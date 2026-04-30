import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StatusPedidoEnum } from '../enum/pedidosEnum';
import { Navbar } from '../../components/navbar';

interface Pedido {
  id: string;
  cliente: string;
  itens: { nome: string; preco: number }[];
  total: number;
  status: StatusPedidoEnum;
}

@Component({
  selector: 'app-fila',
  templateUrl: './component.fila.html',
  styleUrls: ['./component.fila.scss'],
  imports: [Navbar],
})
export class ComponentFila {
  private router = inject(Router);
  public readonly statusEnum = StatusPedidoEnum;

  public activeOrders: Pedido[] = [
    {
      id: '001',
      cliente: 'João',
      itens: [
        { nome: 'Hambúrguer Clássico x2', preco: 44.0 },
        { nome: 'Batata Frita x1', preco: 12.0 },
        { nome: 'Coca-Cola x2', preco: 14.0 },
      ],
      total: 70.0,
      status: StatusPedidoEnum.PREPARANDO,
    },
    {
      id: '002',
      cliente: 'Maria',
      itens: [
        { nome: 'X-Bacon x1', preco: 28.0 },
        { nome: 'Onion Rings x1', preco: 14.0 },
      ],
      total: 42.0,
      status: StatusPedidoEnum.AGUARDANDO,
    },
  ];

  public readyOrders: Pedido[] = [];

  mudarStatus(id: string, novoStatus: StatusPedidoEnum) {
    const index = this.activeOrders.findIndex((p) => p.id === id);

    if (index !== -1) {
      this.activeOrders[index].status = novoStatus;

      if (novoStatus === StatusPedidoEnum.PRONTO) {
        const pedidoPronto = this.activeOrders.splice(index, 1)[0];

        this.readyOrders.push(pedidoPronto);
      }
    }
  }

  protected acessarRota(rota: string) {
    this.router.navigate([rota]);
  }
}
