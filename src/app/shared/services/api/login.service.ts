import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiConfigService } from '../api-config.service';


@Injectable({
  providedIn: 'root',
})

export class LoginApiService {
  constructor(
    private http: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  private get apiUrl(): string {
    return this.apiConfigService.getApiUrl();
  }

  // Login
  loginAPI(useremail: string, password: string): Observable<any> {
    const body = { phoneNumberOrEmail: useremail, password: password };
    return this.http.post<any>(`${this.apiUrl}/Account/LoginAdminPortal`, body).pipe(
      catchError((error) => {
        console.error('Login API Error:', error);
        return throwError(error);
      })
    );
  }
}
