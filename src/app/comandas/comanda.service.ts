import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ItemVendaResumo } from '../novo-pedido/venda.service';

export type StatusComanda = 'ABERTA' | 'FECHADA';

export interface Comanda {
  id: number;
  numero: number;
  status: StatusComanda;
  nomeCliente: string | null;
  valorTotal: number | null;
  dtAbertura: string | null;
  dtFechamento: string | null;
  mesa: { id: number; numero: number };
  usuarioAbertura: { id: number; nome: string } | null;
  vendas: { id: number; status: string; itens: ItemVendaResumo[] | null }[] | null;
}

export interface AbrirComandaPayload {
  mesa: { id: number };
  nomeCliente?: string | null;
}

export interface ItemComandaPayload {
  produto: { id: number };
  quantidade: number;
  preco_unitario: number;
  valor_total: number;
  observacao?: string | null;
  composicaoRemovida?: { composicaoItem: { id: number } }[];
  adicionais?: { adicional: { id: number }; quantidade: number }[];
}

const API_URL = `${environment.apiUrl}/comanda`;

@Injectable({ providedIn: 'root' })
export class ComandaService {
  constructor(private http: HttpClient) {}

  listar(status?: StatusComanda): Observable<Comanda[]> {
    const url = status ? `${API_URL}?status=${status}` : API_URL;
    return this.http.get<Comanda[]>(url);
  }

  buscarPorId(id: number): Observable<Comanda> {
    return this.http.get<Comanda>(`${API_URL}/${id}`);
  }

  abrir(payload: AbrirComandaPayload): Observable<Comanda> {
    return this.http.post<Comanda>(`${API_URL}/abrir`, payload);
  }

  adicionarItens(comandaId: number, usuarioId: number, itens: ItemComandaPayload[]): Observable<unknown> {
    return this.http.post(`${API_URL}/${comandaId}/itens`, {
      usuario: { id: usuarioId },
      itens,
    });
  }

  fechar(comandaId: number, metodoPagamento: string): Observable<Comanda> {
    return this.http.put<Comanda>(`${API_URL}/${comandaId}/fechar`, { metodoPagamento });
  }
}
