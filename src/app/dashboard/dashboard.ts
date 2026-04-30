import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StatusPedidoEnum } from '../enum/pedidosEnum';
import { Navbar } from '../../components/navbar';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent {
  private router = inject(Router);

  public readonly statusEnum = StatusPedidoEnum;
  public statusPedido: StatusPedidoEnum = StatusPedidoEnum.PREPARANDO;

  protected acessarRota(rota: string) {
    this.router.navigate([rota]);
  }

  marcarComoPronto() {
    this.statusPedido = StatusPedidoEnum.PRONTO;
  }

  marcarComoEntregue() {
    this.statusPedido = StatusPedidoEnum.ENTREGUE;
  }

  marcarComoPreparando() {
    this.statusPedido = StatusPedidoEnum.PREPARANDO;
  }

  constructor() {}
}
