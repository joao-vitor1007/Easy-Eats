import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MensagemErroApiUtil } from '../utils/mensagemErroApiUtil';
import { FiltroPeriodo, PeriodoUtil } from '../utils/periodoUtil';
import {
  MovimentacaoFinanceira,
  MovimentacaoFinanceiraService,
} from './movimentacao-financeira.service';

type FiltroTipo = 'Todos' | 'Entradas' | 'Saidas';

// Lançamentos de sangria (retirada do caixa) e do tipo SAIDA contam como
// saída; qualquer outro tipo (ENTRADA, SUPRIMENTO, ou um tipo customizado
// criado aqui) conta como entrada.
const TIPOS_SAIDA = ['SANGRIA', 'SAIDA'];

@Component({
  selector: 'app-gestao-financeira',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestao-financeira.html',
  styleUrl: './gestao-financeira.scss',
})
export class GestaoFinanceira implements OnInit {
  private service = inject(MovimentacaoFinanceiraService);

  filtroTipo: FiltroTipo = 'Todos';
  filtroPeriodo: FiltroPeriodo = 'mes';
  dataInicioCustom = PeriodoUtil.paraIso(new Date());
  dataFimCustom = PeriodoUtil.paraIso(new Date());

  carregando = true;
  erro: string | null = null;
  salvando = false;
  lancamentos: MovimentacaoFinanceira[] = [];

  novoTipo: 'ENTRADA' | 'SAIDA' = 'ENTRADA';
  novaCategoria = '';
  novoValor: number | null = null;
  novaDescricao = '';

  ngOnInit() {
    this.carregar();
  }

  ehSaida(lancamento: MovimentacaoFinanceira): boolean {
    return TIPOS_SAIDA.includes((lancamento.tipo ?? '').toUpperCase());
  }

  get lancamentosFiltrados(): MovimentacaoFinanceira[] {
    if (this.filtroTipo === 'Entradas') {
      return this.lancamentos.filter((l) => !this.ehSaida(l));
    }
    if (this.filtroTipo === 'Saidas') {
      return this.lancamentos.filter((l) => this.ehSaida(l));
    }
    return this.lancamentos;
  }

  get totalGanhos(): number {
    return this.lancamentos.filter((l) => !this.ehSaida(l)).reduce((soma, l) => soma + l.valor, 0);
  }

  get totalGastos(): number {
    return this.lancamentos.filter((l) => this.ehSaida(l)).reduce((soma, l) => soma + l.valor, 0);
  }

  get saldo(): number {
    return this.totalGanhos - this.totalGastos;
  }

  selecionarFiltroTipo(filtro: FiltroTipo) {
    this.filtroTipo = filtro;
  }

  selecionarFiltroPeriodo(filtro: FiltroPeriodo) {
    this.filtroPeriodo = filtro;
    if (filtro !== 'periodo') {
      this.carregar();
    }
  }

  carregar() {
    const { inicio, fim } = PeriodoUtil.resolver(this.filtroPeriodo, {
      inicio: this.dataInicioCustom,
      fim: this.dataFimCustom,
    });
    this.carregando = true;
    this.erro = null;

    this.service.listarPorPeriodo(inicio, fim).subscribe({
      next: (lancamentos) => {
        this.lancamentos = lancamentos;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os lançamentos.';
        this.carregando = false;
      },
    });
  }

  registrarLancamento() {
    if (!this.novaCategoria.trim() || !this.novoValor || this.novoValor <= 0) {
      this.erro = 'Informe a categoria e um valor maior que zero.';
      return;
    }

    this.salvando = true;
    this.erro = null;

    this.service
      .criar({
        tipo: this.novoTipo,
        categoria: this.novaCategoria.trim(),
        valor: this.novoValor,
        descricao: this.novaDescricao.trim() || null,
      })
      .subscribe({
        next: () => {
          this.salvando = false;
          this.novaCategoria = '';
          this.novoValor = null;
          this.novaDescricao = '';
          this.carregar();
        },
        error: (erro) => {
          this.salvando = false;
          this.erro = MensagemErroApiUtil.extrair(erro, 'Não foi possível registrar o lançamento.');
        },
      });
  }

  excluir(lancamento: MovimentacaoFinanceira) {
    if (!confirm(`Excluir o lançamento "${lancamento.categoria}"?`)) {
      return;
    }
    this.service.excluir(lancamento.id).subscribe({
      next: () => this.carregar(),
      error: () => (this.erro = 'Não foi possível excluir o lançamento.'),
    });
  }
}
