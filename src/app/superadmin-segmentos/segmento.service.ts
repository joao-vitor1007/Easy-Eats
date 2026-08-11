import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Funcionalidade } from '../auth/auth.service';

export interface Segmento {
  id: number;
  nome: string;
  descricao: string | null;
  flAtivo: boolean;
  funcionalidades: Funcionalidade[];
}

export type SegmentoPayload = Omit<Segmento, 'id'>;

export const FUNCIONALIDADE_LABELS: Record<Funcionalidade, string> = {
  OPERACAO: 'Operação (mesas e comandas)',
  PEDIDO: 'Pedidos',
  COZINHA: 'Cozinha',
  DELIVERY: 'Delivery',
  ESTOQUE: 'Estoque',
  COMPRAS: 'Compras e fornecedores',
  FINANCEIRO: 'Financeiro',
  PRODUTOS: 'Produtos',
  CLIENTES: 'Clientes e fidelidade',
  USUARIOS: 'Usuários e acessos',
  CONFIGURACOES: 'Configurações',
  CAIXA: 'Frente de caixa',
  CUPONS: 'Cupons e cashback',
};

const API_URL = `${environment.apiUrl}/segmentos`;

@Injectable({ providedIn: 'root' })
export class SegmentoService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Segmento[]> {
    return this.http.get<Segmento[]>(API_URL);
  }

  listarFuncionalidades(): Observable<Funcionalidade[]> {
    return this.http.get<Funcionalidade[]>(`${API_URL}/funcionalidades`);
  }

  buscarPorId(id: number): Observable<Segmento> {
    return this.http.get<Segmento>(`${API_URL}/${id}`);
  }

  criar(segmento: SegmentoPayload): Observable<Segmento> {
    return this.http.post<Segmento>(API_URL, segmento);
  }

  atualizar(id: number, segmento: SegmentoPayload): Observable<Segmento> {
    return this.http.put<Segmento>(`${API_URL}/${id}`, segmento);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
