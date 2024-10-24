import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root',
})
export class ChatApiService {
  constructor(
    private http: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  private get apiUrl(): string {
    return this.apiConfigService.getApiUrl();
  }

  private getHeaders({
    contentType = 'application/json',
    includeContentType = true,
  } = {}) {
    return this.apiConfigService.getHeaders(contentType, includeContentType);
  }
  getChat(
    projectId: number,
    page: number,
    pageSize: number
  ): Observable<ApiResponse> {
    const url = `${this.apiUrl}/Chat/GetChatForAssigntVendor?projectId=${projectId}&page=${page}&pageSize=${pageSize}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('FAQ API Error:', error);
        return throwError(error);
      })
    );
  }
}
