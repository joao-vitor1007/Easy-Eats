import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ItemVendaPayload {
  venda: { id: number };
  produto: { id: number };
  quantidade: number;
  preco_unitario: number;
  valor_total: number;
  observacao?: string | null;
  composicaoRemovida?: { composicaoItem: { id: number } }[];
  adicionais?: { adicional: { id: number }; quantidade: number }[];
}

const API_URL = `${environment.apiUrl}/item-venda`;

@Injectable({ providedIn: 'root' })
export class ItemVendaService {
  constructor(private http: HttpClient) {}

  criar(item: ItemVendaPayload): Observable<unknown> {
    return this.http.post(API_URL, item);
  }
}
