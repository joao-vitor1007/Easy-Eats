import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CashbackConfig, CashbackService } from './cashback.service';
import { Cupom, CupomPayload, CupomService, TipoDesconto } from './cupom.service';

@Component({
  selector: 'app-cupons-cashback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cupons-cashback.html',
  styleUrl: './cupons-cashback.scss',
})
export class CuponsCashback implements OnInit {
  private cupomService = inject(CupomService);
  private cashbackService = inject(CashbackService);

  abaAtiva: 'cupons' | 'cashback' = 'cupons';

  cupons: Cupom[] = [];
  carregandoCupons = true;
  erro: string | null = null;

  novoCupom: CupomPayload = this.cupomVazio();

  cashback: CashbackConfig | null = null;
  carregandoCashback = true;

  ngOnInit() {
    this.carregarCupons();
    this.carregarCashback();
  }

  private cupomVazio(): CupomPayload {
    return {
      codigo: '',
      tipoDesconto: 'PERCENTUAL' as TipoDesconto,
      valorDesconto: 0,
      dtValidadeInicio: null,
      dtValidadeFim: null,
      limiteUsoTotal: null,
      limiteUsoPorCliente: null,
      valorMinimoPedido: null,
      flAtivo: true,
    };
  }

  carregarCupons() {
    this.carregandoCupons = true;
    this.cupomService.listar().subscribe({
      next: (cupons) => {
        this.cupons = cupons;
        this.carregandoCupons = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os cupons.';
        this.carregandoCupons = false;
      },
    });
  }

  criarCupom() {
    if (!this.novoCupom.codigo.trim() || !this.novoCupom.valorDesconto) {
      this.erro = 'Informe o código e o valor do desconto.';
      return;
    }

    this.cupomService.criar(this.novoCupom).subscribe({
      next: (cupom) => {
        this.cupons.push(cupom);
        this.novoCupom = this.cupomVazio();
      },
      error: () => (this.erro = 'Não foi possível criar o cupom. Verifique se o código já existe.'),
    });
  }

  alternarAtivo(cupom: Cupom) {
    const { id, ...payload } = cupom;
    this.cupomService.atualizar(id, { ...payload, flAtivo: !cupom.flAtivo }).subscribe({
      next: (atualizado) => (cupom.flAtivo = atualizado.flAtivo),
      error: () => (this.erro = 'Não foi possível atualizar o cupom.'),
    });
  }

  excluirCupom(cupom: Cupom) {
    this.cupomService.excluir(cupom.id).subscribe({
      next: () => (this.cupons = this.cupons.filter((c) => c.id !== cupom.id)),
      error: () => (this.erro = 'Não foi possível excluir o cupom.'),
    });
  }

  carregarCashback() {
    this.carregandoCashback = true;
    this.cashbackService.buscar().subscribe({
      next: (config) => {
        this.cashback = config;
        this.carregandoCashback = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar a configuração de cashback.';
        this.carregandoCashback = false;
      },
    });
  }

  salvarCashback() {
    if (!this.cashback) return;

    const { id, ...payload } = this.cashback;
    this.cashbackService.atualizar(payload).subscribe({
      next: (config) => (this.cashback = config),
      error: () => (this.erro = 'Não foi possível salvar a configuração de cashback.'),
    });
  }
}
