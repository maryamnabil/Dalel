import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';
@Injectable({
  providedIn: 'root'
})
export class ActivityLogApiService {
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
 
  getLogs (searchText: string,UserId:string, pageIndex: number, pageSize: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Log/GetAll?searchText=${searchText}&?userId=${UserId}&page=${pageIndex}&pageSize=${pageSize}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Category API Error:', error);
          return throwError(error);
        })
      );
  }
}
