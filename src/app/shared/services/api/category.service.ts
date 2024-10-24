import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryApiService {
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
  getCategory(
    searchText: string,
    fromDate: string,
    toDate: string,
    page: number,
    pageSize: number
  ): Observable<ApiResponse> {
    const queryString = `searchText=${searchText}&fromDate=${fromDate}&toDate=${toDate}&page=${page}&pageSize=${pageSize}`;
    const url = `${this.apiUrl}/Category/LoadParentCategory?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  getAllCategories(): Observable<ApiResponse> {
    const url = `${this.apiUrl}/Category/LoadParentCategory`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  getAllSubCategories(): Observable<ApiResponse> {
    const url = `${this.apiUrl}/Category/LoadSubCategory`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  getSubCategory(
    searchText: string,
    fromDate: string,
    toDate: string,
    parentCategory: string,
    page: number,
    pageSize: number
  ): Observable<ApiResponse> {
    const queryString = `searchText=${searchText}&parentCategory=${parentCategory}&fromDate=${fromDate}&toDate=${toDate}&page=${page}&pageSize=${pageSize}`;
    const url = `${this.apiUrl}/Category/LoadSubCategory?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  getCategoryById(id: string): Observable<ApiResponse> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/Category/GetById?Id=${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  addCategory(name: string, nameAr: string, Photo: File): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('Photo', Photo);
    formData.append('Name', name);
    formData.append('NameAr', nameAr);

    return this.http
      .post<any>(`${this.apiUrl}/Category/Add`, formData, {
        headers: this.getHeaders({ includeContentType: false }),
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  addSubCategory(
    ParentCategoryId: string,
    name: string,
    nameAr: string,
    skillIds: string[]
  ): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('ParentCategoryId', ParentCategoryId);
    skillIds.forEach((id) => {
      formData.append('SkillsIds', id);
    });
    formData.append('Name', name);
    formData.append('NameAr', nameAr);

    return this.http
      .post<any>(`${this.apiUrl}/Category/Add`, formData, {
        headers: this.getHeaders({ includeContentType: false }),
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  updateCategory(
    name: string,
    nameAr: string,
    Photo: File,
    id: string
  ): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('Id', id);
    formData.append('Photo', Photo);
    formData.append('Name', name);
    formData.append('NameAr', nameAr);

    return this.http
      .post<any>(`${this.apiUrl}/Category/Update`, formData, {
        headers: this.getHeaders({ includeContentType: false }),
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  updateSubCategory(
    ParentCategoryId: string,
    name: string,
    nameAr: string,
    skillIds: string[],
    id: string
  ): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('ParentCategoryId', ParentCategoryId);
    skillIds.forEach((id) => {
      formData.append('SkillsIds', id);
    });
    formData.append('Name', name);
    formData.append('NameAr', nameAr);
    formData.append('Id', id);

    return this.http
      .post<any>(`${this.apiUrl}/Category/Update`, formData, {
        headers: this.getHeaders({ includeContentType: false }),
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  deleteCategory(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/Category/Delete?id=${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
