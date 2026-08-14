import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Fornecedor {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string | null;
  email: string | null;
  flAtivo: boolean | null;
}

export interface FornecedorPayload {
  nome: string;
  cnpj: string;
  telefone: string | null;
  email: string | null;
  flAtivo: boolean;
}

const API_URL = `${environment.apiUrl}/fornecedores`;

@Injectable({ providedIn: 'root' })
export class FornecedorService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(API_URL);
  }

  criar(fornecedor: FornecedorPayload): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(API_URL, fornecedor);
  }

  atualizar(id: number, fornecedor: FornecedorPayload): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(`${API_URL}/${id}`, fornecedor);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
