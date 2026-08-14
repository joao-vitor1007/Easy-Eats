import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoria, CategoriaService } from './categoria.service';
import { MensagemErroApiUtil } from '../utils/mensagemErroApiUtil';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.scss',
})
export class Categorias implements OnInit {
  private fb = new FormBuilder();

  categorias: Categoria[] = [];
  carregando = true;
  salvando = false;
  erro: string | null = null;
  editandoId: number | null = null;

  form = this.fb.group({
    nome: ['', Validators.required],
    descricao: [''],
    flativo: [true],
  });

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.categoriaService.listar().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = MensagemErroApiUtil.extrair(erro, 'Não foi possível carregar as categorias.');
        this.carregando = false;
      },
    });
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nome, descricao, flativo } = this.form.value;
    const payload = { nome: nome!, descricao: descricao || null, flativo: flativo ?? true };

    this.salvando = true;
    this.erro = null;

    const requisicao =
      this.editandoId !== null
        ? this.categoriaService.atualizar(this.editandoId, payload)
        : this.categoriaService.criar(payload);

    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.editandoId = null;
        this.form.reset({ flativo: true });
        this.carregar();
      },
      error: (erro) => {
        this.erro = MensagemErroApiUtil.extrair(erro, 'Não foi possível salvar a categoria.');
        this.salvando = false;
      },
    });
  }

  editar(categoria: Categoria) {
    this.editandoId = categoria.id;
    this.form.setValue({
      nome: categoria.nome,
      descricao: categoria.descricao ?? '',
      flativo: categoria.flativo ?? true,
    });
  }

  cancelarEdicao() {
    this.editandoId = null;
    this.form.reset({ flativo: true });
  }

  excluir(categoria: Categoria) {
    if (!confirm(`Excluir a categoria "${categoria.nome}"?`)) {
      return;
    }

    this.categoriaService.excluir(categoria.id).subscribe({
      next: () => this.carregar(),
      error: (erro) => {
        this.erro = MensagemErroApiUtil.extrair(
          erro,
          'Não foi possível excluir a categoria. Verifique se ainda há produtos vinculados a ela.',
        );
      },
    });
  }
}
