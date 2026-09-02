import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Insumo, InsumoService } from './insumo.service';
import { MensagemErroApiUtil } from '../utils/mensagemErroApiUtil';

@Component({
  selector: 'app-controle-estoque',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './controle-estoque.html',
  styleUrls: ['./controle-estoque.scss'],
})
export class ControleEstoque implements OnInit {
  private fb = new FormBuilder();

  insumos: Insumo[] = [];
  carregando = true;
  salvando = false;
  erro: string | null = null;
  editandoNome: string | null = null;

  form = this.fb.group({
    nome: ['', Validators.required],
    quantidade: [0, [Validators.required, Validators.min(0)]],
    unidade: ['', Validators.required],
  });

  constructor(private insumoService: InsumoService) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.insumoService.listar().subscribe({
      next: (insumos) => {
        this.insumos = insumos;
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = MensagemErroApiUtil.extrair(erro, 'Não foi possível carregar o estoque.');
        this.carregando = false;
      },
    });
  }

  get totalItens(): number {
    return this.insumos.length;
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nome, quantidade, unidade } = this.form.value;
    const insumo: Insumo = { nome: nome!, quantidade: quantidade!, unidade: unidade! };

    this.salvando = true;
    this.erro = null;

    const requisicao =
      this.editandoNome !== null
        ? this.insumoService.atualizar(this.editandoNome, insumo)
        : this.insumoService.cadastrar(insumo);

    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.editandoNome = null;
        this.form.reset({ quantidade: 0 });
        this.carregar();
      },
      error: (erro) => {
        this.erro = MensagemErroApiUtil.extrair(erro, 'Não foi possível salvar o insumo.');
        this.salvando = false;
      },
    });
  }

  editar(insumo: Insumo) {
    this.editandoNome = insumo.nome;
    this.form.setValue({ nome: insumo.nome, quantidade: insumo.quantidade, unidade: insumo.unidade });
  }

  cancelarEdicao() {
    this.editandoNome = null;
    this.form.reset({ quantidade: 0 });
  }

  remover(insumo: Insumo) {
    if (!confirm(`Remover o insumo "${insumo.nome}" do estoque?`)) {
      return;
    }

    this.insumoService.remover(insumo.nome).subscribe({
      next: () => this.carregar(),
      error: (erro) => {
        this.erro = MensagemErroApiUtil.extrair(erro, 'Não foi possível remover o insumo.');
      },
    });
  }
}
