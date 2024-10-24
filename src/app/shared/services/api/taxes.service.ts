import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root',
})
export class TaxesApiService {
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

  getTaxes(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Configration/GetVAT`, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('Taxes API Error:', error);
        return throwError(error);
      })
    );
  }

  updateTaxes(vatValue: string): Observable<ApiResponse> {
    const headers = this.getHeaders();
    const vatData = { value: vatValue };

    return this.http.post<ApiResponse>(`${this.apiUrl}/Configration/UpdateVAT?value=${vatValue}`, vatData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error updating department:', error);
          return throwError(error);
        })
      );
  }

}
