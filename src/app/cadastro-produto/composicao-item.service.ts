import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ComposicaoItem {
  id: number;
  nome: string;
  removivel: boolean;
}

export interface ComposicaoItemPayload {
  nome: string;
  removivel: boolean;
}

const API_URL = (produtoId: number) => `${environment.apiUrl}/produtos/${produtoId}/composicao`;

@Injectable({ providedIn: 'root' })
export class ComposicaoItemService {
  constructor(private http: HttpClient) {}

  listar(produtoId: number): Observable<ComposicaoItem[]> {
    return this.http.get<ComposicaoItem[]>(API_URL(produtoId));
  }

  criar(produtoId: number, item: ComposicaoItemPayload): Observable<ComposicaoItem> {
    return this.http.post<ComposicaoItem>(API_URL(produtoId), item);
  }

  excluir(produtoId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL(produtoId)}/${id}`);
  }
}
