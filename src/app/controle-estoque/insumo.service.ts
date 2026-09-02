import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Insumo {
  nome: string;
  quantidade: number;
  unidade: string;
}

const API_URL = `${environment.apiUrl}/estoque`;

@Injectable({ providedIn: 'root' })
export class InsumoService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(API_URL);
  }

  cadastrar(insumo: Insumo): Observable<string> {
    return this.http.post(`${API_URL}/insumo`, insumo, { responseType: 'text' });
  }

  atualizar(nomeAtual: string, insumo: Insumo): Observable<string> {
    return this.http.put(`${API_URL}/atualizar/${encodeURIComponent(nomeAtual)}`, insumo, {
      responseType: 'text',
    });
  }

  remover(nome: string): Observable<string> {
    return this.http.delete(`${API_URL}/remover/${encodeURIComponent(nome)}`, { responseType: 'text' });
  }
}
