import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RelatorioFaturamento, VendaService } from '../novo-pedido/venda.service';
import { FiltroPeriodo, PeriodoUtil } from '../utils/periodoUtil';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.html',
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrls: ['./financeiro.scss'],
})
export class Financeiro implements OnInit {
  private vendaService = inject(VendaService);

  filtroSelecionado: FiltroPeriodo = 'hoje';
  dataInicioCustom = PeriodoUtil.paraIso(new Date());
  dataFimCustom = PeriodoUtil.paraIso(new Date());

  carregando = true;
  erro: string | null = null;
  relatorio: RelatorioFaturamento | null = null;

  ngOnInit() {
    this.carregar();
  }

  selecionarFiltro(filtro: FiltroPeriodo) {
    this.filtroSelecionado = filtro;
    if (filtro !== 'periodo') {
      this.carregar();
    }
  }

  carregar() {
    const { inicio, fim } = PeriodoUtil.resolver(this.filtroSelecionado, {
      inicio: this.dataInicioCustom,
      fim: this.dataFimCustom,
    });
    this.carregando = true;
    this.erro = null;

    this.vendaService.relatorio(inicio, fim).subscribe({
      next: (relatorio) => {
        this.relatorio = relatorio;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar o faturamento do período.';
        this.carregando = false;
      },
    });
  }
}
