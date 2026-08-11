import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { ItemVendaResumo, STATUS_PEDIDO, Venda, VendaService } from '../novo-pedido/venda.service';

const INTERVALO_ATUALIZACAO_MS = 10000;

export interface ItemCozinha {
  texto: string;
  removidos: string[];
  adicionais: string[];
  observacao: string | null;
}

@Component({
  selector: 'app-tela-cozinha',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tela-cozinha.html',
  styleUrl: './tela-cozinha.scss',
})
export class TelaCozinha implements OnInit, OnDestroy {
  private vendaService = inject(VendaService);
  private atualizacaoAutomatica?: Subscription;

  vendas: Venda[] = [];
  carregando = true;
  erro: string | null = null;

  ngOnInit() {
    this.carregar();
    this.atualizacaoAutomatica = interval(INTERVALO_ATUALIZACAO_MS).subscribe(() => this.carregar(false));
  }

  ngOnDestroy() {
    this.atualizacaoAutomatica?.unsubscribe();
  }

  carregar(mostrarCarregando = true) {
    if (mostrarCarregando) {
      this.carregando = true;
    }

    this.vendaService.listar().subscribe({
      next: (vendas) => {
        this.vendas = vendas.filter((v) => v.status !== STATUS_PEDIDO.ENTREGUE);
        this.carregando = false;
        this.erro = null;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os pedidos.';
        this.carregando = false;
      },
    });
  }

  get aguardando(): Venda[] {
    return this.vendas.filter((v) => v.status === STATUS_PEDIDO.AGUARDANDO);
  }

  get preparando(): Venda[] {
    return this.vendas.filter((v) => v.status === STATUS_PEDIDO.PREPARANDO);
  }

  get prontos(): Venda[] {
    return this.vendas.filter((v) => v.status === STATUS_PEDIDO.PRONTO);
  }

  identificacao(venda: Venda): string {
    if (venda.mesa) {
      return `Mesa ${venda.mesa.numero}`;
    }
    return venda.nomeCliente || 'Balcão';
  }

  itensResumo(venda: Venda): ItemCozinha[] {
    return (venda.itens ?? []).map((item) => this.detalhesItem(item));
  }

  private detalhesItem(item: ItemVendaResumo): ItemCozinha {
    return {
      texto: `${item.produto?.nome ?? 'Item'} x${item.quantidade}`,
      removidos: (item.composicaoRemovida ?? []).map((r) => r.composicaoItem.nome),
      adicionais: (item.adicionais ?? []).map((a) =>
        a.quantidade > 1 ? `${a.nome} x${a.quantidade}` : a.nome,
      ),
      observacao: item.observacao || null,
    };
  }

  avancar(venda: Venda) {
    const proximoStatus = this.proximoStatus(venda.status);
    if (!proximoStatus || !venda.usuario) {
      return;
    }

    this.vendaService.atualizarStatus(venda.id, proximoStatus, venda.tipo, venda.usuario.id).subscribe({
      next: () => this.carregar(false),
      error: () => {
        this.erro = 'Não foi possível atualizar o status do pedido.';
      },
    });
  }

  private proximoStatus(atual: string): string | null {
    switch (atual) {
      case STATUS_PEDIDO.AGUARDANDO:
        return STATUS_PEDIDO.PREPARANDO;
      case STATUS_PEDIDO.PREPARANDO:
        return STATUS_PEDIDO.PRONTO;
      case STATUS_PEDIDO.PRONTO:
        return STATUS_PEDIDO.ENTREGUE;
      default:
        return null;
    }
  }

  abrirNovaJanela() {
    window.open(
      window.location.origin + '/tela-cozinha',
      '_blank',
      'width=1400,height=900,noopener,noreferrer',
    );
  }
}
