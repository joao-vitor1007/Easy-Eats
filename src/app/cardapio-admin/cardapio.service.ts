import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Cardapio {
  id: number;
  nome: string;
  descricao: string | null;
  flAtivo: boolean;
  padrao: boolean;
}

export interface CardapioPayload {
  nome: string;
  descricao?: string | null;
  flAtivo: boolean;
}

const API_URL = `${environment.apiUrl}/cardapio`;

@Injectable({ providedIn: 'root' })
export class CardapioService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Cardapio[]> {
    return this.http.get<Cardapio[]>(API_URL);
  }

  criar(cardapio: CardapioPayload): Observable<Cardapio> {
    return this.http.post<Cardapio>(API_URL, cardapio);
  }

  marcarPadrao(id: number): Observable<Cardapio> {
    return this.http.put<Cardapio>(`${API_URL}/${id}/marcar-padrao`, {});
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
