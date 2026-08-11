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

const API_URL = `${environment.apiUrl}/categoria`;

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(API_URL);
  }
}
