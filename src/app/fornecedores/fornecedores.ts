import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fornecedor, FornecedorService } from './fornecedor.service';
import { MensagemErroApiUtil } from '../utils/mensagemErroApiUtil';

@Component({
  selector: 'app-fornecedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fornecedores.html',
  styleUrl: './fornecedores.scss',
})
export class Fornecedores implements OnInit {
  private fb = new FormBuilder();

  fornecedores: Fornecedor[] = [];
  carregando = true;
  salvando = false;
  erro: string | null = null;
  editandoId: number | null = null;

  form = this.fb.group({
    nome: ['', Validators.required],
    cnpj: ['', Validators.required],
    telefone: [''],
    email: ['', Validators.email],
    flAtivo: [true],
  });

  constructor(private fornecedorService: FornecedorService) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.fornecedorService.listar().subscribe({
      next: (fornecedores) => {
        this.fornecedores = fornecedores;
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = MensagemErroApiUtil.extrair(erro, 'Não foi possível carregar os fornecedores.');
        this.carregando = false;
      },
    });
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nome, cnpj, telefone, email, flAtivo } = this.form.value;
    const payload = {
      nome: nome!,
      cnpj: cnpj!,
      telefone: telefone || null,
      email: email || null,
      flAtivo: flAtivo ?? true,
    };

    this.salvando = true;
    this.erro = null;

    const requisicao =
      this.editandoId !== null
        ? this.fornecedorService.atualizar(this.editandoId, payload)
        : this.fornecedorService.criar(payload);

    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.editandoId = null;
        this.form.reset({ flAtivo: true });
        this.carregar();
      },
      error: (erro) => {
        this.erro = MensagemErroApiUtil.extrair(erro, 'Não foi possível salvar o fornecedor.');
        this.salvando = false;
      },
    });
  }

  editar(fornecedor: Fornecedor) {
    this.editandoId = fornecedor.id;
    this.form.setValue({
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      telefone: fornecedor.telefone ?? '',
      email: fornecedor.email ?? '',
      flAtivo: fornecedor.flAtivo ?? true,
    });
  }

  cancelarEdicao() {
    this.editandoId = null;
    this.form.reset({ flAtivo: true });
  }

  excluir(fornecedor: Fornecedor) {
    if (!confirm(`Excluir o fornecedor "${fornecedor.nome}"?`)) {
      return;
    }

    this.fornecedorService.excluir(fornecedor.id).subscribe({
      next: () => this.carregar(),
      error: (erro) => {
        this.erro = MensagemErroApiUtil.extrair(erro, 'Não foi possível excluir o fornecedor.');
      },
    });
  }
}
