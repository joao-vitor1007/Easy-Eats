import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { STATUS_PEDIDO, Venda, VendaService } from '../novo-pedido/venda.service';
import { MensagemErroApiUtil } from '../utils/mensagemErroApiUtil';

@Component({
  selector: 'app-historico-vendas',
  standalone: true,
  templateUrl: './historico-vendas.html',
  styleUrls: ['./historico-vendas.scss'],
  imports: [CommonModule, FormsModule],
})
export class HistoricoVendasComponent implements OnInit {
  busca = '';
  carregando = true;
  erro: string | null = null;

  vendas: Venda[] = [];

  filtros = ['Todos', STATUS_PEDIDO.AGUARDANDO, STATUS_PEDIDO.PREPARANDO, STATUS_PEDIDO.PRONTO, STATUS_PEDIDO.ENTREGUE];
  filtroSelecionado = 'Todos';

  constructor(private vendaService: VendaService) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.vendaService.listar().subscribe({
      next: (vendas) => {
        this.vendas = vendas;
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = MensagemErroApiUtil.extrair(erro, 'Não foi possível carregar o histórico de vendas.');
        this.carregando = false;
      },
    });
  }

  selecionarFiltro(filtro: string) {
    this.filtroSelecionado = filtro;
  }

  identificacao(venda: Venda): string {
    if (venda.mesa) {
      return `Mesa ${venda.mesa.numero}`;
    }
    return venda.nomeCliente || 'Balcão';
  }

  totalVenda(venda: Venda): number {
    return (venda.itens ?? []).reduce((total, item) => total + (item.valor_total ?? 0), 0);
  }

  get vendasFiltradas(): Venda[] {
    return this.vendas
      .filter((venda) => this.filtroSelecionado === 'Todos' || venda.status === this.filtroSelecionado)
      .filter((venda) => {
        const termo = this.busca.toLowerCase().trim();
        if (!termo) {
          return true;
        }
        return this.identificacao(venda).toLowerCase().includes(termo) || venda.id.toString().includes(termo);
      });
  }

  get totalFiltrado(): number {
    return this.vendasFiltradas.reduce((total, venda) => total + this.totalVenda(venda), 0);
  }

  get totalVendas(): number {
    return this.vendasFiltradas.length;
  }
}
