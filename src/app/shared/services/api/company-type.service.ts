import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyTypeService {

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
  getCompanyTypes(searchText: string, page: number, pageSize: number): Observable<ApiResponse> {
    const queryString = `text=${searchText}&page=${page}&pageSize=${pageSize}`;
    const url = `${this.apiUrl}/CompanyType/Load?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('FAQ API Error:', error);
          return throwError(error);
        })
      );
  }

  addCompany(name: string, nameAr: string): Observable<any> {
    const body = { name, nameAr };
    return this.http.post<any>(`${this.apiUrl}/CompanyType/Add`, body, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error adding FAQ:', error);
          return throwError(error);
        })
      );
  }

  deleteCompany(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/CompanyType/Delete?id=${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error deleting FAQ:', error);
          return throwError(error);
        })
      );
  }
}