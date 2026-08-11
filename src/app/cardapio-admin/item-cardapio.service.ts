import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ItemCardapio {
  id: number;
  produto: { id: number; nome: string; preco: number };
  ordem: number;
  disponivel: boolean;
  precoOverride: number | null;
  descricaoOverride: string | null;
  fotoUrl: string | null;
}

const API_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class ItemCardapioService {
  constructor(private http: HttpClient) {}

  listar(cardapioId: number): Observable<ItemCardapio[]> {
    return this.http.get<ItemCardapio[]>(`${API_URL}/cardapio/${cardapioId}/itens`);
  }

  adicionar(cardapioId: number, produtoId: number): Observable<ItemCardapio> {
    return this.http.post<ItemCardapio>(`${API_URL}/cardapio/${cardapioId}/itens`, {
      produto: { id: produtoId },
    });
  }

  // O PUT do backend sobrescreve ordem/overrides com o que vier no corpo — por
  // isso reenvia o item inteiro (com o campo alterado) em vez de um patch
  // parcial, para não zerar os outros campos a cada alternância de status.
  atualizarDisponibilidade(item: ItemCardapio, disponivel: boolean): Observable<ItemCardapio> {
    return this.http.put<ItemCardapio>(`${API_URL}/item-cardapio/${item.id}`, {
      ordem: item.ordem,
      disponivel,
      precoOverride: item.precoOverride,
      descricaoOverride: item.descricaoOverride,
      fotoUrl: item.fotoUrl,
    });
  }

  remover(itemId: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/item-cardapio/${itemId}`);
  }
}
