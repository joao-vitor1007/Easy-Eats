import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Produto, ProdutoService } from '../cadastro-produto/produto.service';
import { Cardapio, CardapioService } from './cardapio.service';
import { ItemCardapio, ItemCardapioService } from './item-cardapio.service';

@Component({
  selector: 'app-cardapio-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cardapio-admin.html',
  styleUrl: './cardapio-admin.scss',
})
export class CardapioAdmin implements OnInit {
  private cardapioService = inject(CardapioService);
  private itemCardapioService = inject(ItemCardapioService);
  private produtoService = inject(ProdutoService);

  cardapios: Cardapio[] = [];
  produtos: Produto[] = [];
  itens: ItemCardapio[] = [];

  cardapioSelecionado: Cardapio | null = null;
  nomeNovoCardapio = '';

  carregando = true;
  erro: string | null = null;

  ngOnInit() {
    this.produtoService.listar().subscribe((produtos) => (this.produtos = produtos));
    this.carregarCardapios();
  }

  carregarCardapios() {
    this.carregando = true;
    this.cardapioService.listar().subscribe({
      next: (cardapios) => {
        this.cardapios = cardapios;
        this.carregando = false;
        if (!this.cardapioSelecionado && cardapios.length > 0) {
          this.selecionarCardapio(cardapios[0]);
        }
      },
      error: () => {
        this.erro = 'Não foi possível carregar os cardápios.';
        this.carregando = false;
      },
    });
  }

  criarCardapio() {
    const nome = this.nomeNovoCardapio.trim();
    if (!nome) return;

    this.cardapioService.criar({ nome, flAtivo: true }).subscribe({
      next: (cardapio) => {
        this.nomeNovoCardapio = '';
        this.cardapios.push(cardapio);
        this.selecionarCardapio(cardapio);
      },
      error: () => (this.erro = 'Não foi possível criar o cardápio.'),
    });
  }

  selecionarCardapio(cardapio: Cardapio) {
    this.cardapioSelecionado = cardapio;
    this.itemCardapioService.listar(cardapio.id).subscribe((itens) => (this.itens = itens));
  }

  marcarPadrao(cardapio: Cardapio) {
    this.cardapioService.marcarPadrao(cardapio.id).subscribe({
      next: () => {
        this.cardapios.forEach((c) => (c.padrao = c.id === cardapio.id));
      },
      error: () => (this.erro = 'Não foi possível marcar como padrão.'),
    });
  }

  produtosDisponiveisParaAdicionar(): Produto[] {
    const idsNoCardapio = new Set(this.itens.map((item) => item.produto.id));
    return this.produtos.filter((produto) => !idsNoCardapio.has(produto.id));
  }

  adicionarProduto(produto: Produto) {
    if (!this.cardapioSelecionado) return;

    this.itemCardapioService.adicionar(this.cardapioSelecionado.id, produto.id).subscribe({
      next: (item) => this.itens.push(item),
      error: () => (this.erro = 'Não foi possível adicionar o produto ao cardápio.'),
    });
  }

  alternarDisponibilidade(item: ItemCardapio) {
    this.itemCardapioService.atualizarDisponibilidade(item, !item.disponivel).subscribe({
      next: (atualizado) => (item.disponivel = atualizado.disponivel),
      error: () => (this.erro = 'Não foi possível atualizar a disponibilidade do item.'),
    });
  }

  removerItem(item: ItemCardapio) {
    this.itemCardapioService.remover(item.id).subscribe({
      next: () => (this.itens = this.itens.filter((i) => i.id !== item.id)),
      error: () => (this.erro = 'Não foi possível remover o item do cardápio.'),
    });
  }
}
