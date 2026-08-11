import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ModalProdutoComponent } from '../../components/modal-produto/modalProduto';
import { CarregandoComponent } from '../../components/carregando/carregando';
import { AuthService } from '../auth/auth.service';
import { Produto, ProdutoService } from '../cadastro-produto/produto.service';
import { ItemComandaPayload, Comanda, ComandaService } from '../comandas/comanda.service';
import { Mesa, MesaService } from '../mesas/mesa.service';
import { CustomizacaoProduto, customizacaoVazia, mesmaCustomizacao } from './carrinho.model';
import { ItemVendaService } from './item-venda.service';
import { STATUS_PEDIDO, VendaService } from './venda.service';
import { MensagemErroApiUtil } from '../utils/mensagemErroApiUtil';

const ICONE_POR_CATEGORIA: Record<string, string> = {
  Lanches: 'bi-egg-fried',
  Acompanhamentos: 'bi-basket3',
  Bebidas: 'bi-cup-straw',
};

interface ItemCarrinho {
  id: number;
  produto: Produto;
  qtd: number;
  customizacao: CustomizacaoProduto;
}

let proximoIdCarrinho = 0;

@Component({
  selector: 'app-novo-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalProdutoComponent, CarregandoComponent],
  templateUrl: './novo-pedido.html',
  styleUrls: ['./novo-pedido.scss'],
})
export class NovoPedido implements OnInit {
  private produtoService = inject(ProdutoService);
  private mesaService = inject(MesaService);
  private vendaService = inject(VendaService);
  private itemVendaService = inject(ItemVendaService);
  private comandaService = inject(ComandaService);
  private route = inject(ActivatedRoute);
  protected authService = inject(AuthService);

  cliente = '';
  mesaSelecionada: number | null = null;

  produtos: Produto[] = [];
  mesas: Mesa[] = [];

  // Mesa -> comanda aberta, para lançar o pedido nela em vez de criar uma
  // Venda solta (ver mesas.ts, que já abre a comanda antes de chegar aqui).
  private comandaPorMesa = new Map<number, Comanda>();

  categorias: string[] = ['Todos'];
  categoriaSelecionada = 'Todos';

  carregando = true;
  enviando = false;
  erro: string | null = null;
  sucesso = false;

  carrinho: ItemCarrinho[] = [];
  produtoSelecionado: Produto | null = null;

  get usaMesa(): boolean {
    return this.authService.temFuncionalidade('OPERACAO');
  }

  ngOnInit() {
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos.filter((p) => p.flAtivo !== false);
        const nomesCategorias = new Set(
          this.produtos.map((p) => p.categoria?.nome).filter((nome): nome is string => !!nome),
        );
        this.categorias = ['Todos', ...nomesCategorias];
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os produtos.';
        this.carregando = false;
      },
    });

    if (this.usaMesa) {
      this.mesaService.listar().subscribe((mesas) => (this.mesas = mesas));

      this.comandaService.listar('ABERTA').subscribe((comandas) => {
        this.comandaPorMesa = new Map(comandas.map((comanda) => [comanda.mesa.id, comanda]));

        const mesaDaRota = Number(this.route.snapshot.queryParamMap.get('mesa'));
        if (mesaDaRota) {
          this.mesaSelecionada = mesaDaRota;
        }
      });
    }
  }

  selecionarCategoria(cat: string) {
    this.categoriaSelecionada = cat;
  }

  iconeCategoria(nomeCategoria?: string | null): string {
    if (!nomeCategoria) return 'bi-basket3';
    return ICONE_POR_CATEGORIA[nomeCategoria] ?? 'bi-basket3';
  }

  produtosFiltrados(): Produto[] {
    if (this.categoriaSelecionada === 'Todos') return this.produtos;
    return this.produtos.filter((p) => p.categoria?.nome === this.categoriaSelecionada);
  }

  adicionarAoCarrinho(produto: Produto, customizacao: CustomizacaoProduto = customizacaoVazia()) {
    const itemExistente = this.carrinho.find(
      (item) => item.produto.id === produto.id && mesmaCustomizacao(item.customizacao, customizacao),
    );

    if (itemExistente) {
      itemExistente.qtd++;
    } else {
      this.carrinho.push({ id: proximoIdCarrinho++, produto, qtd: 1, customizacao });
    }
  }

  aoAdicionarDoModal(evento: { produto: Produto; customizacao: CustomizacaoProduto }) {
    this.adicionarAoCarrinho(evento.produto, evento.customizacao);
  }

  precoUnitario(item: ItemCarrinho): number {
    const totalAdicionais = item.customizacao.adicionaisSelecionados.reduce(
      (soma, sel) => soma + sel.adicional.preco * sel.quantidade,
      0,
    );
    return item.produto.preco + totalAdicionais;
  }

  aumentarQtd(index: number) {
    this.carrinho[index].qtd++;
  }

  diminuirQtd(index: number) {
    if (this.carrinho[index].qtd > 1) {
      this.carrinho[index].qtd--;
    } else {
      this.carrinho.splice(index, 1);
    }
  }

  total(): number {
    return this.carrinho.reduce((soma, item) => soma + this.precoUnitario(item) * item.qtd, 0);
  }

  podeFinalizar(): boolean {
    if (this.carrinho.length === 0) return false;
    return this.usaMesa ? this.mesaSelecionada !== null || !!this.cliente.trim() : true;
  }

  confirmarPedido() {
    if (!this.podeFinalizar() || this.enviando) {
      return;
    }

    const usuarioId = this.authService.usuario()?.id;
    if (!usuarioId) {
      this.erro = 'Sessão inválida, faça login novamente.';
      return;
    }

    this.enviando = true;
    this.erro = null;

    const comandaAberta = this.mesaSelecionada ? this.comandaPorMesa.get(this.mesaSelecionada) : undefined;

    if (comandaAberta) {
      this.comandaService
        .adicionarItens(comandaAberta.id, usuarioId, this.carrinho.map((item) => this.paraPayloadComanda(item)))
        .subscribe({
          next: () => this.finalizarComSucesso(),
          error: (erro) => {
            this.enviando = false;
            this.erro = MensagemErroApiUtil.extrair(
              erro,
              'Não foi possível lançar os itens na comanda. Tente novamente.',
            );
          },
        });
      return;
    }

    const mesa = this.usaMesa && this.mesaSelecionada ? { id: this.mesaSelecionada } : null;

    this.vendaService
      .criar({
        status: STATUS_PEDIDO.AGUARDANDO,
        tipo: mesa ? 'Mesa' : 'Balcão',
        mesa,
        nomeCliente: this.cliente.trim() || null,
        usuario: { id: usuarioId },
      })
      .subscribe({
        next: (venda) => this.enviarItens(venda.id),
        error: (erro) => {
          this.enviando = false;
          this.erro = MensagemErroApiUtil.extrair(erro, 'Não foi possível criar o pedido. Tente novamente.');
        },
      });
  }

  private enviarItens(vendaId: number) {
    const chamadas = this.carrinho.map((item) =>
      this.itemVendaService.criar({
        venda: { id: vendaId },
        ...this.paraPayloadComanda(item),
      }),
    );

    forkJoin(chamadas).subscribe({
      next: () => this.finalizarComSucesso(),
      error: (erro) => {
        this.enviando = false;
        this.erro = MensagemErroApiUtil.extrair(
          erro,
          'O pedido foi criado, mas houve um problema ao salvar os itens.',
        );
      },
    });
  }

  private paraPayloadComanda(item: ItemCarrinho): ItemComandaPayload {
    return {
      produto: { id: item.produto.id },
      quantidade: item.qtd,
      preco_unitario: this.precoUnitario(item),
      valor_total: this.precoUnitario(item) * item.qtd,
      observacao: item.customizacao.observacao || null,
      composicaoRemovida: item.customizacao.composicaoRemovidaIds.map((id) => ({ composicaoItem: { id } })),
      adicionais: item.customizacao.adicionaisSelecionados.map((sel) => ({
        adicional: { id: sel.adicional.id },
        quantidade: sel.quantidade,
      })),
    };
  }

  private finalizarComSucesso() {
    this.enviando = false;
    this.sucesso = true;
    this.carrinho = [];
    this.cliente = '';
    this.mesaSelecionada = null;
    setTimeout(() => (this.sucesso = false), 4000);
  }

  abrirDetalhes(produto: Produto) {
    this.produtoSelecionado = produto;
  }

  fecharModal() {
    this.produtoSelecionado = null;
  }
}
