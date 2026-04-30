import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar';

@Component({
  selector: 'app-novo-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './novo-pedido.html',
  styleUrls: ['./novo-pedido.scss'],
})
export class NovoPedido {
  cliente = '';
  private router = inject(Router);

  categorias = ['Todos', 'Lanches', 'Acompanhamentos', 'Bebidas'];
  categoriaSelecionada = 'Todos';

  produtos = [
    { nome: 'Hambúrguer Clássico', preco: 22, categoria: 'Lanches', emoji: '🍔' },
    { nome: 'X-Bacon', preco: 28, categoria: 'Lanches', emoji: '🥓' },
    { nome: 'X-Salada', preco: 25, categoria: 'Lanches', emoji: '🥗' },
    { nome: 'Hot Dog', preco: 15, categoria: 'Lanches', emoji: '🌭' },
    { nome: 'Batata Frita', preco: 12, categoria: 'Acompanhamentos', emoji: '🍟' },
    { nome: 'Onion Rings', preco: 14, categoria: 'Acompanhamentos', emoji: '🧅' },
    { nome: 'Nuggets', preco: 16, categoria: 'Acompanhamentos', emoji: '🍗' },
    { nome: 'Coca-Cola', preco: 7, categoria: 'Bebidas', emoji: '🥤' },
    { nome: 'Guaraná', preco: 7, categoria: 'Bebidas', emoji: '🧃' },
    { nome: 'Água', preco: 4, categoria: 'Bebidas', emoji: '💧' },
    { nome: 'Suco Natural', preco: 10, categoria: 'Bebidas', emoji: '🍊' },
    { nome: 'Milk Shake', preco: 18, categoria: 'Bebidas', emoji: '🥛' },
  ];

  carrinho: any[] = [];

  protected acessarRota(rota: string) {
    this.router.navigate([rota]);
  }

  selecionarCategoria(cat: string) {
    this.categoriaSelecionada = cat;
  }

  produtosFiltrados() {
    if (this.categoriaSelecionada === 'Todos') return this.produtos;
    return this.produtos.filter((p) => p.categoria === this.categoriaSelecionada);
  }

  adicionarAoCarrinho(produto: any) {
    const itemExistente = this.carrinho.find((p) => p.nome === produto.nome);

    if (itemExistente) {
      itemExistente.qtd++;
    } else {
      this.carrinho.push({ ...produto, qtd: 1 });
    }
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

  total() {
    return this.carrinho.reduce((sum, item) => sum + item.preco * item.qtd, 0);
  }

  confirmarPedido() {
    console.log('Pedido:', this.carrinho);
  }

  abrirDetalhes(produto: any) {
    alert(`Detalhes do produto:\n\n${produto.nome}\nPreço: R$ ${produto.preco.toFixed(2)}`);
  }
}
