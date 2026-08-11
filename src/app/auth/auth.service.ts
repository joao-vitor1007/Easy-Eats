import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export type Perfil = 'SUPERADMIN' | 'ADMINISTRADOR' | 'OPERADOR' | 'GARCOM' | 'COZINHEIRO';

export type Funcionalidade =
  | 'OPERACAO'
  | 'PEDIDO'
  | 'COZINHA'
  | 'DELIVERY'
  | 'ESTOQUE'
  | 'COMPRAS'
  | 'FINANCEIRO'
  | 'PRODUTOS'
  | 'CLIENTES'
  | 'USUARIOS'
  | 'CONFIGURACOES'
  | 'CAIXA'
  | 'CUPONS';

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  role: Perfil;
  funcionalidades: Funcionalidade[];
}

interface AuthResponse {
  token: string;
  usuarioId: number;
  nome: string;
  email: string;
  role: Perfil;
  funcionalidades: Funcionalidade[];
}

const CHAVE_TOKEN = 'easyeats.token';
const CHAVE_USUARIO = 'easyeats.usuario';
const API_URL = `${environment.apiUrl}/auth`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  usuario = signal<UsuarioLogado | null>(this.recuperarUsuario());

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/login`, { email, senha }).pipe(
      tap((resposta) => {
        sessionStorage.setItem(CHAVE_TOKEN, resposta.token);
        const usuario: UsuarioLogado = {
          id: resposta.usuarioId,
          nome: resposta.nome,
          email: resposta.email,
          role: resposta.role,
          funcionalidades: resposta.funcionalidades ?? [],
        };
        sessionStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
        this.usuario.set(usuario);
      }),
    );
  }

  logout(): void {
    sessionStorage.removeItem(CHAVE_TOKEN);
    sessionStorage.removeItem(CHAVE_USUARIO);
    this.usuario.set(null);
  }

  getToken(): string | null {
    return sessionStorage.getItem(CHAVE_TOKEN);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdministrador(): boolean {
    return this.usuario()?.role === 'ADMINISTRADOR';
  }

  isSuperadmin(): boolean {
    return this.usuario()?.role === 'SUPERADMIN';
  }

  isGarcom(): boolean {
    return this.usuario()?.role === 'GARCOM';
  }

  isCozinheiro(): boolean {
    return this.usuario()?.role === 'COZINHEIRO';
  }

  isOperador(): boolean {
    return this.usuario()?.role === 'OPERADOR';
  }

  temFuncionalidade(codigo: Funcionalidade): boolean {
    if (this.isSuperadmin()) {
      return true;
    }
    return this.usuario()?.funcionalidades?.includes(codigo) ?? false;
  }

  private recuperarUsuario(): UsuarioLogado | null {
    const bruto = sessionStorage.getItem(CHAVE_USUARIO);
    return bruto ? JSON.parse(bruto) : null;
  }
}
