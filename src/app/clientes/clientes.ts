import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente, ClienteService } from './cliente.service';
import { MensagemErroApiUtil } from '../utils/mensagemErroApiUtil';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss',
})
export class Clientes implements OnInit {
  private fb = new FormBuilder();

  clientes: Cliente[] = [];
  carregando = true;
  salvando = false;
  erro: string | null = null;
  editandoId: number | null = null;
  busca = '';

  form = this.fb.group({
    nome: ['', Validators.required],
    telefone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    endereco: [''],
  });

  constructor(private clienteService: ClienteService) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.clienteService.listar().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = MensagemErroApiUtil.extrair(erro, 'Não foi possível carregar os clientes.');
        this.carregando = false;
      },
    });
  }

  get clientesFiltrados(): Cliente[] {
    const termo = this.busca.toLowerCase().trim();
    if (!termo) {
      return this.clientes;
    }
    return this.clientes.filter((c) => c.nome.toLowerCase().includes(termo));
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nome, telefone, email, endereco } = this.form.value;
    const payload = { nome: nome!, telefone: telefone!, email: email!, endereco: endereco || null };

    this.salvando = true;
    this.erro = null;

    const requisicao =
      this.editandoId !== null
        ? this.clienteService.atualizar(this.editandoId, payload)
        : this.clienteService.criar(payload);

    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.editandoId = null;
        this.form.reset();
        this.carregar();
      },
      error: (erro) => {
        this.erro = MensagemErroApiUtil.extrair(erro, 'Não foi possível salvar o cliente.');
        this.salvando = false;
      },
    });
  }

  editar(cliente: Cliente) {
    this.editandoId = cliente.id;
    this.form.setValue({
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email,
      endereco: cliente.endereco ?? '',
    });
  }

  cancelarEdicao() {
    this.editandoId = null;
    this.form.reset();
  }

  excluir(cliente: Cliente) {
    if (!confirm(`Excluir o cliente "${cliente.nome}"?`)) {
      return;
    }

    this.clienteService.excluir(cliente.id).subscribe({
      next: () => this.carregar(),
      error: (erro) => {
        this.erro = MensagemErroApiUtil.extrair(erro, 'Não foi possível excluir o cliente.');
      },
    });
  }
}
