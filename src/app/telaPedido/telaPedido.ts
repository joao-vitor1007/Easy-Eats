import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-tela-pedido',
  templateUrl: './telaPedido.html',
  styleUrls: ['./telaPedido.scss'],
  imports: [NgFor]
})
export class TelaPedido {

  produtos = [
    { nome: 'Hambúrguer Clássico', preco: 22, emoji: '🍔' },
    { nome: 'X-Bacon', preco: 28, emoji: '🥓' },
    { nome: 'X-Salada', preco: 25, emoji: '🥗' },
    { nome: 'Hot Dog', preco: 15, emoji: '🌭' },
    { nome: 'Batata Frita', preco: 12, emoji: '🍟' },
    { nome: 'Onion Rings', preco: 14, emoji: '🧅' },
    { nome: 'Nuggets', preco: 16, emoji: '🍗' },
    { nome: 'Coca-Cola', preco: 7, emoji: '🥤' },
    { nome: 'Guaraná', preco: 7, emoji: '🧃' },
    { nome: 'Água', preco: 4, emoji: '💧' },
    { nome: 'Suco Natural', preco: 10, emoji: '🍊' },
    { nome: 'Milk Shake', preco: 18, emoji: '🥛' }
  ];

  carrinho: any[] = [];

  adicionar(produto: any) {
    const item = this.carrinho.find(p => p.nome === produto.nome);

    if (item) {
      item.qtd++;
    } else {
      this.carrinho.push({ ...produto, qtd: 1 });
    }
  }

  aumentar(item: any) {
    item.qtd++;
  }

  diminuir(item: any) {
    item.qtd--;

    if (item.qtd <= 0) {
      this.carrinho = this.carrinho.filter(p => p !== item);
    }
  }

  total() {
    return this.carrinho.reduce((acc, item) => {
      return acc + (item.preco * item.qtd);
    }, 0);
  }
}