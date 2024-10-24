import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  private apiUrl = environment.apiUrl;

  constructor(private localStorageService: LocalStorageService) {}

  getApiUrl(): string {
    return this.apiUrl;
  }

  getHeaders(
    contentType = 'application/json',
    includeContentType = true
  ): HttpHeaders {
    const token = this.localStorageService.getItem('token');
    return new HttpHeaders({
      ...(includeContentType ? { 'Content-Type': contentType } : null),
      Authorization: `Bearer ${token}`,
    });
  }
}
