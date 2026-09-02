import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Categoria {
  id: number;
  nome: string;
  descricao: string | null;
  flativo: boolean | null;
}

export interface CategoriaPayload {
  nome: string;
  descricao: string | null;
  flativo: boolean;
}

const API_URL = `${environment.apiUrl}/categoria`;

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(API_URL);
  }

  criar(categoria: CategoriaPayload): Observable<Categoria> {
    return this.http.post<Categoria>(API_URL, categoria);
  }

  atualizar(id: number, categoria: CategoriaPayload): Observable<Categoria> {
    return this.http.put<Categoria>(`${API_URL}/${id}`, categoria);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
