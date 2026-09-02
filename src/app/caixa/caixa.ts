import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { PeriodoUtil } from '../utils/periodoUtil';
import { Caixa, CaixaService } from './caixa.service';

@Component({
  selector: 'app-caixa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caixa.html',
  styleUrl: './caixa.scss',
})
export class CaixaComponent implements OnInit {
  private caixaService = inject(CaixaService);
  protected authService = inject(AuthService);

  caixa: Caixa | null = null;
  carregando = true;
  erro: string | null = null;
  processando = false;

  mostrarHistorico = false;
  carregandoHistorico = false;
  historico: Caixa[] = [];

  valorInicial: number | null = null;
  observacoesAbertura = '';

  valorApuradoInformado: number | null = null;
  observacoesFechamento = '';

  valorMovimentacao: number | null = null;
  descricaoMovimentacao = '';

  get podeOperar(): boolean {
    return this.authService.isAdministrador() || this.authService.isOperador();
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.caixaService.status().subscribe({
      next: (caixa) => {
        this.caixa = caixa;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar o status do caixa.';
        this.carregando = false;
      },
    });
  }

  abrirCaixa() {
    if (this.valorInicial === null || this.valorInicial < 0) {
      this.erro = 'Informe o valor inicial do caixa.';
      return;
    }

    this.processando = true;
    this.caixaService.abrir(this.valorInicial, this.observacoesAbertura).subscribe({
      next: (caixa) => {
        this.caixa = caixa;
        this.processando = false;
        this.valorInicial = null;
        this.observacoesAbertura = '';
      },
      error: () => {
        this.erro = 'Não foi possível abrir o caixa.';
        this.processando = false;
      },
    });
  }

  fecharCaixa() {
    if (!this.caixa || this.valorApuradoInformado === null) {
      this.erro = 'Informe o valor apurado para fechar o caixa.';
      return;
    }

    this.processando = true;
    this.caixaService.fechar(this.caixa.id, this.valorApuradoInformado, this.observacoesFechamento).subscribe({
      next: () => {
        // Recarrega o status (em vez de usar a sessão fechada retornada
        // diretamente) para a tela voltar ao estado "nenhum caixa aberto".
        this.carregar();
        this.processando = false;
        this.valorApuradoInformado = null;
        this.observacoesFechamento = '';
        this.historico = [];
        if (this.mostrarHistorico) {
          this.carregarHistorico();
        }
      },
      error: () => {
        this.erro = 'Não foi possível fechar o caixa.';
        this.processando = false;
      },
    });
  }

  alternarHistorico() {
    this.mostrarHistorico = !this.mostrarHistorico;
    if (this.mostrarHistorico && this.historico.length === 0) {
      this.carregarHistorico();
    }
  }

  carregarHistorico() {
    const { inicio, fim } = PeriodoUtil.resolver('mes');
    this.carregandoHistorico = true;
    this.caixaService.historico(inicio, fim).subscribe({
      next: (historico) => {
        this.historico = historico;
        this.carregandoHistorico = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar o histórico de fechamentos.';
        this.carregandoHistorico = false;
      },
    });
  }

  registrarMovimentacao(tipo: 'SANGRIA' | 'SUPRIMENTO') {
    if (!this.caixa || this.valorMovimentacao === null || this.valorMovimentacao <= 0) {
      this.erro = 'Informe um valor maior que zero.';
      return;
    }

    this.processando = true;
    this.caixaService.registrarMovimentacao(this.caixa.id, tipo, this.valorMovimentacao, this.descricaoMovimentacao).subscribe({
      next: () => {
        this.processando = false;
        this.valorMovimentacao = null;
        this.descricaoMovimentacao = '';
      },
      error: () => {
        this.erro = 'Não foi possível registrar a movimentação.';
        this.processando = false;
      },
    });
  }
}
