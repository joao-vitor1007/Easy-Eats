import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Produto } from '../cadastro-produto/produto.service';

export const STATUS_PEDIDO = {
  AGUARDANDO: 'Aguardando',
  PREPARANDO: 'Preparando',
  PRONTO: 'Pronto',
  ENTREGUE: 'Entregue',
} as const;

export type StatusPedido = (typeof STATUS_PEDIDO)[keyof typeof STATUS_PEDIDO];

export interface ItemVendaResumo {
  id: number;
  quantidade: number;
  preco_unitario: number;
  valor_total: number | null;
  observacao?: string | null;
  composicaoRemovida?: { composicaoItem: { id: number; nome: string } }[] | null;
  adicionais?: { id: number; nome: string; preco: number; quantidade: number }[] | null;
  produto: Produto;
}

export interface Venda {
  id: number;
  status: string;
  tipo: string;
  origem: string | null;
  valor_total: number | null;
  desconto: number | null;
  dataCriacao: string | null;
  mesa: { id: number; numero: number } | null;
  nomeCliente: string | null;
  cliente: { id: number; nome: string; saldoCashback: number | null } | null;
  cupom: { id: number; codigo: string } | null;
  usuario: { id: number; nome: string } | null;
  itens: ItemVendaResumo[] | null;
}

export interface VendaPayload {
  status: string;
  tipo: string;
  mesa: { id: number } | null;
  nomeCliente: string | null;
  cliente: { id: number } | null;
  usuario: { id: number };
}

export interface ProdutoRanking {
  nomeProduto: string;
  quantidadeVendida: number;
  faturamentoTotal: number;
}

export interface RelatorioFaturamento {
  totalFaturado: number;
  ticketMedio: number;
  quantidadeVendas: number;
}

const API_URL = `${environment.apiUrl}/venda`;

@Injectable({ providedIn: 'root' })
export class VendaService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Venda[]> {
    return this.http.get<Venda[]>(API_URL);
  }

  criar(venda: VendaPayload): Observable<Venda> {
    return this.http.post<Venda>(API_URL, venda);
  }

  atualizarStatus(id: number, status: string, tipo: string, usuarioId: number): Observable<Venda> {
    return this.http.put<Venda>(`${API_URL}/${id}`, { status, tipo, usuario: { id: usuarioId } });
  }

  ranking(): Observable<ProdutoRanking[]> {
    return this.http.get<ProdutoRanking[]>(`${API_URL}/ranking`);
  }

  relatorio(inicio: string, fim: string): Observable<RelatorioFaturamento> {
    return this.http.get<RelatorioFaturamento>(`${API_URL}/relatorio`, { params: { inicio, fim } });
  }

  aplicarCupom(vendaId: number, codigo: string): Observable<Venda> {
    return this.http.post<Venda>(`${API_URL}/${vendaId}/cupom`, { codigo });
  }

  resgatarCashback(vendaId: number, valor: number): Observable<Venda> {
    return this.http.post<Venda>(`${API_URL}/${vendaId}/resgatar-cashback`, { valor });
  }
}
