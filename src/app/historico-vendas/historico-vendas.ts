import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar';

interface Pedido {
  id: number;
  cliente: string;
  itens: { nome: string; quantidade: number }[];
  horario: string;
  status: 'aguardando' | 'preparando' | 'pronto';
  total: number;
}

@Component({
  selector: 'app-historico-vendas',
  templateUrl: './historico-vendas.html',
  styleUrls: ['./historico-vendas.scss'],
  imports: [Navbar],
})
export class HistoricoVendasComponent {
  private router = inject(Router);
  filtroSelecionado: 'todos' | 'aguardando' | 'preparando' | 'pronto' = 'todos';

  pedidos: Pedido[] = [
    {
      id: 1,
      cliente: 'João',
      itens: [
        { nome: 'Hambúrguer Clássico', quantidade: 2 },
        { nome: 'Batata Frita', quantidade: 1 },
        { nome: 'Coca-Cola', quantidade: 2 },
      ],
      horario: '02:21',
      status: 'preparando',
      total: 70,
    },
    {
      id: 2,
      cliente: 'Maria',
      itens: [
        { nome: 'X-Bacon', quantidade: 1 },
        { nome: 'Onion Rings', quantidade: 1 },
      ],
      horario: '02:21',
      status: 'aguardando',
      total: 42,
    },
  ];

  filtroStatus: string = 'todos';
  busca: string = '';

  get pedidosFiltrados(): Pedido[] {
    return this.pedidos
      .filter((p) => {
        if (this.filtroStatus === 'todos') return true;
        return p.status === this.filtroStatus;
      })
      .filter((p) => {
        const termo = this.busca.toLowerCase();
        return p.cliente.toLowerCase().includes(termo) || p.id.toString().includes(termo);
      })
      .sort((a, b) => b.id - a.id);
  }

  get totalFiltrado(): number {
    return this.pedidosFiltrados.reduce((sum, p) => sum + p.total, 0);
  }

  get totalPedidos(): number {
    return this.pedidosFiltrados.length;
  }

  mudarFiltro(status: string) {
    this.filtroStatus = status;
  }

  selecionarFiltro(filtro: any) {
    this.filtroSelecionado = filtro;
  }

  protected acessarRota(rota: string) {
    this.router.navigate([rota]);
  }
}
