import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Natureza determina o comportamento do produto no pedido: só PREPARADO
// exibe composição editável e adicionais no carrinho (ver alerta de
// modelagem do módulo de produtos).
export type NaturezaProduto = 'INSUMO' | 'REVENDA' | 'PREPARADO';

export interface Produto {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  custo: number | null;
  flAtivo: boolean;
  natureza: NaturezaProduto | null;
  categoria: { id: number; nome: string } | null;
}

export interface ProdutoPayload {
  nome: string;
  descricao: string | null;
  preco: number;
  custo: number | null;
  flAtivo: boolean;
  natureza: NaturezaProduto;
  categoria: { id: number } | null;
}

const API_URL = `${environment.apiUrl}/produtos`;

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(API_URL);
  }

  criar(produto: ProdutoPayload): Observable<Produto> {
    return this.http.post<Produto>(API_URL, produto);
  }

  atualizar(id: number, produto: ProdutoPayload): Observable<Produto> {
    return this.http.put<Produto>(`${API_URL}/${id}`, produto);
  }
}
