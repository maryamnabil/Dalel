import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(
    private http: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  private get apiUrl(): string {
    return this.apiConfigService.getApiUrl();
  }

  private getHeaders(contentType = 'application/json') {
    return this.apiConfigService.getHeaders(contentType);
  }

  getWallets(searchText: string, page: number, pageSize: number) {
    const url = `${this.apiUrl}/Wallet/LoadAll?text=${searchText}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  getUserWallet(userId: string) {
    const url = `${this.apiUrl}/Wallet/GetUserWallet?userId=${userId}`;
    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  getCounters() {
    const url = `${this.apiUrl}/Wallet/api/Wallet/GetCounters`;
    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  addTransaction(userId: string, price: number, description: string) {
    const url = `${this.apiUrl}/Wallet/AddTransaction`;
    const body = {
      userId,
      price,
      description,
    };
    return this.http
      .post<ApiResponse>(url, body, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          return of(error);
        })
      );
  }
}
