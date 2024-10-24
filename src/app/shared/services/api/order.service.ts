import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';
import { CertificateLinkType } from 'src/app/core/enums/certificate-link-type.enum';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private http: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  private get apiUrl(): string {
    return this.apiConfigService.getApiUrl();
  }

  private getHeaders(
    contentType = 'application/json',
    includeContentType = true
  ) {
    return this.apiConfigService.getHeaders(contentType, includeContentType);
  }

  getOrders(
    searchText: string,
    fromDate: string,
    toDate: string,
    page: number,
    pageSize: number,
    userId = ''
  ): Observable<ApiResponse> {
    const queryString = `searchText=${searchText}&fromDate=${fromDate}&toDate=${toDate}&page=${page}&pageSize=${pageSize}&userId=${userId}`;
    const url = `${this.apiUrl}/Order/Load?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Certificate Link Error:', error);
        return throwError(error);
      })
    );
  }

  getOrderById(id: number): Observable<ApiResponse> {
    const url = `${this.apiUrl}/Order/GetById?id=${id}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Certificate Link Error:', error);
        return throwError(error);
      })
    );
  }
}
