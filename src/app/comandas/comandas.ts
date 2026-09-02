import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comanda, ComandaService } from './comanda.service';

@Component({
  selector: 'app-comandas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comandas.html',
  styleUrl: './comandas.scss',
})
export class Comandas implements OnInit {
  private comandaService = inject(ComandaService);

  comandas: Comanda[] = [];
  carregando = true;
  erro: string | null = null;
  fechando: number | null = null;

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.comandaService.listar().subscribe({
      next: (comandas) => {
        this.comandas = comandas;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar as comandas.';
        this.carregando = false;
      },
    });
  }

  get comandasAbertas(): number {
    return this.comandas.filter((c) => c.status === 'ABERTA').length;
  }

  get valorTotalEmAberto(): number {
    return this.comandas.filter((c) => c.status === 'ABERTA').reduce((total, c) => total + this.totalComanda(c), 0);
  }

  totalComanda(comanda: Comanda): number {
    if (comanda.valorTotal) return comanda.valorTotal;
    if (!comanda.vendas) return 0;
    return comanda.vendas.reduce(
      (soma, venda) => soma + (venda.itens ?? []).reduce((s, item) => s + (item.valor_total ?? 0), 0),
      0,
    );
  }

  quantidadeItens(comanda: Comanda): number {
    if (!comanda.vendas) return 0;
    return comanda.vendas.reduce((soma, venda) => soma + (venda.itens?.length ?? 0), 0);
  }

  badgeClasse(status: string): string {
    return status === 'ABERTA' ? 'alerta' : 'sucesso';
  }

  fecharComanda(comanda: Comanda) {
    const metodo = prompt('Forma de pagamento (dinheiro, pix, credito, debito):', 'pix');
    if (!metodo) return;

    this.fechando = comanda.id;
    this.comandaService.fechar(comanda.id, metodo).subscribe({
      next: () => {
        this.fechando = null;
        this.carregar();
      },
      error: () => {
        this.fechando = null;
        this.erro = 'Não foi possível fechar a comanda. Verifique se ela possui itens lançados.';
      },
    });
  }
}
