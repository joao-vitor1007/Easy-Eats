import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type TipoDesconto = 'PERCENTUAL' | 'VALOR_FIXO';

export interface Cupom {
  id: number;
  codigo: string;
  tipoDesconto: TipoDesconto;
  valorDesconto: number;
  dtValidadeInicio: string | null;
  dtValidadeFim: string | null;
  limiteUsoTotal: number | null;
  limiteUsoPorCliente: number | null;
  valorMinimoPedido: number | null;
  flAtivo: boolean;
}

export type CupomPayload = Omit<Cupom, 'id'>;

const API_URL = `${environment.apiUrl}/cupom`;

@Injectable({ providedIn: 'root' })
export class CupomService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Cupom[]> {
    return this.http.get<Cupom[]>(API_URL);
  }

  criar(cupom: CupomPayload): Observable<Cupom> {
    return this.http.post<Cupom>(API_URL, cupom);
  }

  atualizar(id: number, cupom: CupomPayload): Observable<Cupom> {
    return this.http.put<Cupom>(`${API_URL}/${id}`, cupom);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
