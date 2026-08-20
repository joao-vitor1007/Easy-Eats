import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MovimentacaoFinanceira {
  id: number;
  tipo: string;
  categoria: string;
  valor: number;
  descricao: string | null;
  dataMovimentacao: string | null;
}

export interface MovimentacaoFinanceiraPayload {
  tipo: string;
  categoria: string;
  valor: number;
  descricao: string | null;
}

const API_URL = `${environment.apiUrl}/movimentacao_financeira`;

@Injectable({ providedIn: 'root' })
export class MovimentacaoFinanceiraService {
  constructor(private http: HttpClient) {}

  listarPorPeriodo(inicio: string, fim: string): Observable<MovimentacaoFinanceira[]> {
    return this.http.get<MovimentacaoFinanceira[]>(API_URL, { params: { inicio, fim } });
  }

  criar(movimentacao: MovimentacaoFinanceiraPayload): Observable<MovimentacaoFinanceira> {
    return this.http.post<MovimentacaoFinanceira>(API_URL, movimentacao);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
