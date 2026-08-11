import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToggleSwitchComponent } from '../../components/toggle-switch/toggle-switch';
import { CarregandoComponent } from '../../components/carregando/carregando';
import { ModalCadastroProduto } from '../../components/modal-cadastro-produto/modal-cadastro-produto';
import { Adicional, AdicionalService } from './adicional.service';
import { Categoria, CategoriaService } from '../categorias/categoria.service';
import { ComposicaoItem, ComposicaoItemService } from './composicao-item.service';
import { NaturezaProduto, Produto, ProdutoService } from './produto.service';
import { MensagemErroApiUtil } from '../utils/mensagemErroApiUtil';

const NATUREZAS: { valor: NaturezaProduto; label: string }[] = [
  { valor: 'PREPARADO', label: 'Preparado/montado (ex.: X-Burger)' },
  { valor: 'REVENDA', label: 'Revenda (ex.: refrigerante lacrado)' },
  { valor: 'INSUMO', label: 'Insumo/matéria-prima (ex.: pão, queijo)' },
];

@Component({
  selector: 'app-cadastro-produto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToggleSwitchComponent,
    CarregandoComponent,
    ModalCadastroProduto,
  ],
  templateUrl: './cadastroProduto.html',
  styleUrls: ['./cadastroProduto.scss'],
})
export class CadastroProdutoComponent implements OnInit {
  naturezas = NATUREZAS;
  categorias: Categoria[] = [];
  produtos: Produto[] = [];

  carregando = true;
  enviando = false;
  erro: string | null = null;

  produtoParaConfirmar: Produto | null = null;

  form = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: Validators.required }),
    descricao: new FormControl('', { nonNullable: true }),
    categoriaId: new FormControl<number | null>(null, Validators.required),
    natureza: new FormControl<NaturezaProduto | null>(null, Validators.required),
    preco: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    custo: new FormControl<number | null>(null, Validators.min(0)),
    flAtivo: new FormControl(true, { nonNullable: true }),
  });

  produtoExpandidoId: number | null = null;
  composicaoPorProduto: Record<number, ComposicaoItem[]> = {};
  adicionaisPorProduto: Record<number, Adicional[]> = {};
  carregandoDetalhes = false;

  novoItemComposicaoNome = '';
  novoAdicionalNome = '';
  novoAdicionalPreco: number | null = null;

  constructor(
    private produtoService: ProdutoService,
    private categoriaService: CategoriaService,
    private composicaoItemService: ComposicaoItemService,
    private adicionalService: AdicionalService,
  ) {}

  ngOnInit() {
    this.categoriaService.listar().subscribe({
      next: (categorias) => (this.categorias = categorias),
      error: () => {},
    });
    this.carregarProdutos();
  }

  private carregarProdutos() {
    this.carregando = true;
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os produtos cadastrados.';
        this.carregando = false;
      },
    });
  }

  salvar() {
    if (this.form.invalid || this.enviando) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    this.enviando = true;
    this.erro = null;

    this.produtoService
      .criar({
        nome: valores.nome,
        descricao: valores.descricao || null,
        preco: valores.preco!,
        custo: valores.custo,
        flAtivo: valores.flAtivo,
        natureza: valores.natureza!,
        categoria: { id: valores.categoriaId! },
      })
      .subscribe({
        next: (produtoCriado) => {
          this.enviando = false;
          this.produtos = [produtoCriado, ...this.produtos];
          this.produtoParaConfirmar = produtoCriado;
          this.form.reset({ flAtivo: true, descricao: '' });
        },
        error: (erro) => {
          this.enviando = false;
          this.erro = MensagemErroApiUtil.extrair(
            erro,
            'Não foi possível cadastrar o produto. Verifique os dados e tente novamente.',
          );
        },
      });
  }

  fecharModalConfirmacao() {
    this.produtoParaConfirmar = null;
  }

  get exibeComposicao(): boolean {
    const produto = this.produtos.find((p) => p.id === this.produtoExpandidoId);
    return produto?.natureza === 'PREPARADO';
  }

  get exibeAdicionais(): boolean {
    const produto = this.produtos.find((p) => p.id === this.produtoExpandidoId);
    return produto?.natureza === 'PREPARADO' || produto?.natureza === 'REVENDA';
  }

  alternarExpandir(produto: Produto) {
    if (this.produtoExpandidoId === produto.id) {
      this.produtoExpandidoId = null;
      return;
    }

    this.produtoExpandidoId = produto.id;
    this.novoItemComposicaoNome = '';
    this.novoAdicionalNome = '';
    this.novoAdicionalPreco = null;
    this.carregarDetalhes(produto.id);
  }

  private carregarDetalhes(produtoId: number) {
    this.carregandoDetalhes = true;
    this.composicaoItemService.listar(produtoId).subscribe({
      next: (itens) => {
        this.composicaoPorProduto[produtoId] = itens;
        this.carregandoDetalhes = false;
      },
      error: () => (this.carregandoDetalhes = false),
    });
    this.adicionalService.listar(produtoId).subscribe({
      next: (adicionais) => (this.adicionaisPorProduto[produtoId] = adicionais),
      error: () => {},
    });
  }

  adicionarItemComposicao(produtoId: number) {
    const nome = this.novoItemComposicaoNome.trim();
    if (!nome) return;

    this.composicaoItemService.criar(produtoId, { nome, removivel: true }).subscribe({
      next: (item) => {
        this.composicaoPorProduto[produtoId] = [...(this.composicaoPorProduto[produtoId] ?? []), item];
        this.novoItemComposicaoNome = '';
      },
    });
  }

  excluirItemComposicao(produtoId: number, itemId: number) {
    this.composicaoItemService.excluir(produtoId, itemId).subscribe({
      next: () => {
        this.composicaoPorProduto[produtoId] = (this.composicaoPorProduto[produtoId] ?? []).filter(
          (i) => i.id !== itemId,
        );
      },
    });
  }

  adicionarAdicional(produtoId: number) {
    const nome = this.novoAdicionalNome.trim();
    if (!nome || this.novoAdicionalPreco === null || this.novoAdicionalPreco < 0) return;

    this.adicionalService.criar(produtoId, { nome, preco: this.novoAdicionalPreco }).subscribe({
      next: (adicional) => {
        this.adicionaisPorProduto[produtoId] = [...(this.adicionaisPorProduto[produtoId] ?? []), adicional];
        this.novoAdicionalNome = '';
        this.novoAdicionalPreco = null;
      },
    });
  }

  excluirAdicional(produtoId: number, adicionalId: number) {
    this.adicionalService.excluir(produtoId, adicionalId).subscribe({
      next: () => {
        this.adicionaisPorProduto[produtoId] = (this.adicionaisPorProduto[produtoId] ?? []).filter(
          (a) => a.id !== adicionalId,
        );
      },
    });
  }
}
