import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {
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

  getDashboardData(fromDate: string, toDate: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}/Dashboard/Counters?fromDate=${fromDate}&toDate=${toDate}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Certificate Link Error:', error);
        return throwError(error);
      })
    );
  }

  getVisitorsChart(fromDate: string, toDate: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}/Dashboard/GetVisitorsChart?dateFrom=${fromDate}&dateTo=${toDate}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Certificate Link Error:', error);
        return throwError(error);
      })
    );
  }
}
