import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string | null;
  saldoCashback: number | null;
}

export interface ClientePayload {
  nome: string;
  email: string;
  telefone: string;
  endereco: string | null;
}

const API_URL = `${environment.apiUrl}/cliente`;

@Injectable({ providedIn: 'root' })
export class ClienteService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(API_URL);
  }

  criar(cliente: ClientePayload): Observable<Cliente> {
    return this.http.post<Cliente>(API_URL, cliente);
  }

  atualizar(id: number, cliente: ClientePayload): Observable<Cliente> {
    return this.http.put<Cliente>(`${API_URL}/${id}`, cliente);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
