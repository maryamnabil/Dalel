import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root',
})
export class PagesApiService {
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

  getPages(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Page/LoadNames`, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('Pages API Error:', error);
        return throwError(error);
      })
    );
  }
}
