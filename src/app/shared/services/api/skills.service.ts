import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root',
})
export class SkillsApiService {
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

  getSkills(
    searchText: string,
    subCatId: string,
    fromDate: string,
    toDate: string,
    page: number,
    pageSize: number
  ): Observable<ApiResponse> {
    const queryString = `text=${searchText}&subCatId=${subCatId}&fromDate=${fromDate}&toDate=${toDate}&page=${page}&pageSize=${pageSize}`;
    const url = `${this.apiUrl}/Skills/Load?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getAllSkills(): Observable<ApiResponse> {
    const url = `${this.apiUrl}/Skills/Load`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getSkillById(id: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}/Skills/GetById?Id=${id}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  addSkill(name: string, nameAr: string): Observable<any> {
    const body = { name, nameAr };

    return this.http
      .post<any>(`${this.apiUrl}/Skills/Add`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error adding FAQ:', error);
          return throwError(error);
        })
      );
  }

  updateSkill(id: number, name: string, nameAr: string): Observable<any> {
    const body = { id, name, nameAr };

    return this.http
      .post<any>(`${this.apiUrl}/Skills/Edit`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error adding FAQ:', error);
          return throwError(error);
        })
      );
  }

  deleteSkill(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/Skills/Delete?id=${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
