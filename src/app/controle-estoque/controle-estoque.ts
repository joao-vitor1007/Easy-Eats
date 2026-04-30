import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar';

@Component({
  selector: 'app-controle-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './controle-estoque.html',
  styleUrls: ['./controle-estoque.scss'],
})
export class ControleEstoque {
  estoqueBaixo = [
    { nome: 'Batata Frita', emoji: '🍟', atual: 3, minimo: 10 },
    { nome: 'Guaraná', emoji: '🥤', atual: 2, minimo: 10 },
  ];

  tipoMovimentacao: 'entrada' | 'saida' = 'entrada';

  produtos = ['Batata Frita', 'Guaraná', 'Hambúrguer', 'Refrigerante'];

  produtoSelecionado = '';
  quantidade = '';
  observacao = '';

  alternarTipo(tipo: 'entrada' | 'saida') {
    this.tipoMovimentacao = tipo;
  }

  registrarMovimentacao() {
    if (!this.produtoSelecionado || !this.quantidade) {
      alert('Selecione o produto e informe a quantidade!');
      return;
    }
    // Aqui você pode adicionar lógica para salvar o movimento
    alert(`${this.tipoMovimentacao === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso!`);

    // Resetar campos
    this.produtoSelecionado = '';
    this.quantidade = '';
    this.observacao = '';
  }
}
