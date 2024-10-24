import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root',
})
export class CertificateTypeService {
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

  getAllCertificateTypes() {
    const url = `${this.apiUrl}/CertificateType/LoadAllNames`;
    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('FAQ API Error:', error);
        return throwError(error);
      })
    );
  }

  getCertificateTypes(
    searchText: string,
    page: number,
    pageSize: number | null
  ): Observable<ApiResponse> {
    const queryString = `text=${searchText}&page=${page}&pageSize=${pageSize}`;
    const url = `${this.apiUrl}/CertificateType/Load?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('FAQ API Error:', error);
        return throwError(error);
      })
    );
  }

  getCertificateById(id: number): Observable<ApiResponse> {
    const queryString = `Id=${id}`;
    const url = `${this.apiUrl}/CertificateType/GetById?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('FAQ API Error:', error);
        return throwError(error);
      })
    );
  }

  addCertificate(name: string, nameAr: string): Observable<any> {
    const body = { name, nameAr };
    return this.http
      .post<any>(`${this.apiUrl}/CertificateType/Add`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error adding FAQ:', error);
          return throwError(error);
        })
      );
  }

  updateCertificateType(
    id: number,
    name: string,
    nameAr: string
  ): Observable<any> {
    const body = { id, name, nameAr };
    return this.http
      .post<any>(`${this.apiUrl}/CertificateType/Edit`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error adding FAQ:', error);
          return throwError(error);
        })
      );
  }

  deleteCertificate(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/CertificateType/Delete?id=${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error deleting FAQ:', error);
          return throwError(error);
        })
      );
  }
}
