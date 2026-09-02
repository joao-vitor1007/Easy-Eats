import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ComandaService } from '../comandas/comanda.service';
import { Mesa, MesaService } from './mesa.service';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mesas.html',
  styleUrl: './mesas.scss',
})
export class Mesas implements OnInit {
  private mesaService = inject(MesaService);
  private comandaService = inject(ComandaService);
  private router = inject(Router);

  mesas: Mesa[] = [];
  carregando = true;
  erro: string | null = null;
  abrindoMesaId: number | null = null;

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.mesaService.listar().subscribe({
      next: (mesas) => {
        this.mesas = mesas;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar as mesas.';
        this.carregando = false;
      },
    });
  }

  get totalLivres(): number {
    return this.mesas.filter((m) => m.status === 'LIVRE').length;
  }

  get totalOcupadas(): number {
    return this.mesas.filter((m) => m.status === 'OCUPADA').length;
  }

  get totalReservadas(): number {
    return this.mesas.filter((m) => m.status === 'RESERVADA').length;
  }

  badgeClasse(status: string): string {
    switch (status) {
      case 'LIVRE':
        return 'sucesso';
      case 'OCUPADA':
        return 'alerta';
      case 'RESERVADA':
        return 'neutro';
      default:
        return 'neutro';
    }
  }

  rotulo(status: string): string {
    switch (status) {
      case 'LIVRE':
        return 'Livre';
      case 'OCUPADA':
        return 'Ocupada';
      case 'RESERVADA':
        return 'Reservada';
      default:
        return status;
    }
  }

  /**
   * Mesa livre: abre uma comanda nova e já leva para o pedido. Mesa ocupada:
   * só leva para o pedido (a comanda aberta é resolvida lá, por mesa).
   */
  selecionarMesa(mesa: Mesa) {
    if (this.abrindoMesaId) return;

    if (mesa.status !== 'LIVRE') {
      this.router.navigate(['/novo-pedido'], { queryParams: { mesa: mesa.id } });
      return;
    }

    this.abrindoMesaId = mesa.id;
    this.comandaService.abrir({ mesa: { id: mesa.id } }).subscribe({
      next: () => {
        this.abrindoMesaId = null;
        this.router.navigate(['/novo-pedido'], { queryParams: { mesa: mesa.id } });
      },
      error: () => {
        this.abrindoMesaId = null;
        this.erro = 'Não foi possível abrir a comanda dessa mesa.';
      },
    });
  }
}
