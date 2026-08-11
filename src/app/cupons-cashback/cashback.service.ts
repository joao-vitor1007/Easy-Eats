import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CashbackConfig {
  id: number;
  percentualAcumulo: number;
  valorMinimoParaAcumular: number | null;
  flAtivo: boolean;
}

const API_URL = `${environment.apiUrl}/cashback-config`;

@Injectable({ providedIn: 'root' })
export class CashbackService {
  constructor(private http: HttpClient) {}

  buscar(): Observable<CashbackConfig> {
    return this.http.get<CashbackConfig>(API_URL);
  }

  atualizar(config: Omit<CashbackConfig, 'id'>): Observable<CashbackConfig> {
    return this.http.put<CashbackConfig>(API_URL, config);
  }
}
