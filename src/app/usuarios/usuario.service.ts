import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Perfil } from '../auth/auth.service';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: Perfil;
  flAtivo: boolean | null;
}

export interface UsuarioPayload {
  nome: string;
  email: string;
  senha: string;
  role: Perfil;
  flAtivo: boolean;
}

const API_URL = `${environment.apiUrl}/usuarios`;

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(API_URL);
  }

  criar(usuario: UsuarioPayload): Observable<Usuario> {
    return this.http.post<Usuario>(API_URL, usuario);
  }
}
