import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root',
})
export class NewsCategoryApiService {
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
  getNewsCategory(
    searchText: string,
    fromDate: string,
    toDate: string,
    page: number,
    pageSize: number
  ): Observable<ApiResponse> {
    const queryString = `fromDate=${fromDate}&toDate=${toDate}&text=${searchText}&page=${page}&pageSize=${pageSize}`;
    const url = `${this.apiUrl}/NewsCategory/Load?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getAllCategories(): Observable<ApiResponse> {
    const url = `${this.apiUrl}/NewsCategory/Load`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  getNewsCategoryById(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/NewsCategory/GetById?Id=${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  addNewsCategory(
    titleEn: string,
    titleAr: string,
    descriptionEn: string,
    descriptionAr: string
  ): Observable<any> {
    const formData = new FormData();

    formData.append('Name', titleEn);
    formData.append('NameAr', titleAr);
    formData.append('Description', descriptionEn);
    formData.append('DescriptionAr', descriptionAr);

    return this.http
      .post<any>(`${this.apiUrl}/NewsCategory/Add`, formData, {
        headers: this.getHeaders({ includeContentType: false }),
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  editNewsCategory(
    id: string,
    titleEn: string,
    titleAr: string,
    descriptionEn: string,
    descriptionAr: string
  ): Observable<any> {
    // Create FormData object to send multipart form data
    const formData = new FormData();

    // Append strings to FormData
    formData.append('Id', id);
    formData.append('Name', titleEn);
    formData.append('NameAr', titleAr);
    formData.append('Description', descriptionEn);
    formData.append('DescriptionAr', descriptionAr);

    return this.http
      .post<any>(`${this.apiUrl}/NewsCategory/Edit`, formData, {
        headers: this.getHeaders({ includeContentType: false }),
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  deleteNewsCategory(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/NewsCategory/Delete?id=${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
