import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type StatusCaixa = 'ABERTO' | 'FECHADO';

export interface Caixa {
  id: number;
  status: StatusCaixa;
  valorInicial: number;
  valorApuradoInformado: number | null;
  valorApuradoSistema: number | null;
  diferenca: number | null;
  dtAbertura: string | null;
  dtFechamento: string | null;
  observacoesAbertura: string | null;
  observacoesFechamento: string | null;
  usuarioAbertura: { id: number; nome: string } | null;
  usuarioFechamento: { id: number; nome: string } | null;
}

const API_URL = `${environment.apiUrl}/caixa`;

@Injectable({ providedIn: 'root' })
export class CaixaService {
  constructor(private http: HttpClient) {}

  status(): Observable<Caixa | null> {
    return this.http.get<Caixa | null>(`${API_URL}/status`);
  }

  abrir(valorInicial: number, observacoes?: string): Observable<Caixa> {
    return this.http.post<Caixa>(`${API_URL}/abrir`, { valorInicial, observacoes });
  }

  fechar(id: number, valorApuradoInformado: number, observacoes?: string): Observable<Caixa> {
    return this.http.put<Caixa>(`${API_URL}/${id}/fechar`, { valorApuradoInformado, observacoes });
  }

  registrarMovimentacao(
    id: number,
    tipo: 'SANGRIA' | 'SUPRIMENTO',
    valor: number,
    descricao?: string,
  ): Observable<unknown> {
    return this.http.post(`${API_URL}/${id}/movimentacao`, { tipo, valor, descricao });
  }
}
