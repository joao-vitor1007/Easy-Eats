import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Adicional {
  id: number;
  nome: string;
  preco: number;
}

export interface AdicionalPayload {
  nome: string;
  preco: number;
}

const API_URL = (produtoId: number) => `${environment.apiUrl}/produtos/${produtoId}/adicionais`;

@Injectable({ providedIn: 'root' })
export class AdicionalService {
  constructor(private http: HttpClient) {}

  listar(produtoId: number): Observable<Adicional[]> {
    return this.http.get<Adicional[]>(API_URL(produtoId));
  }

  criar(produtoId: number, adicional: AdicionalPayload): Observable<Adicional> {
    return this.http.post<Adicional>(API_URL(produtoId), adicional);
  }

  excluir(produtoId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL(produtoId)}/${id}`);
  }
}
