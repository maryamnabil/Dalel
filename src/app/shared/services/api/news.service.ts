import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root',
})
export class NewsApiService {
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
  getNews(
    categoryId: string,
    searchText: string,
    fromDate: string,
    toDate: string,
    page: number,
    pageSize: number
  ): Observable<ApiResponse> {
    const queryString = `fromDate=${fromDate}&toDate=${toDate}&text=${searchText}&categoryId=${categoryId}&page=${page}&pageSize=${pageSize}`;
    const url = `${this.apiUrl}/News/Load?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('FAQ API Error:', error);
        return throwError(error);
      })
    );
  }
  getNewsById(faqId: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/News/GetById?Id=${faqId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Get FAQ By ID API Error:', error);
          return throwError(error);
        })
      );
  }

  addNews(
    newsCategoryId: string,
    titleEn: string,
    titleAr: string,
    descriptionEn: string,
    descriptionAr: string,
    attachments: File[]
  ): Observable<any> {
    const formData = new FormData();

    // Append strings to FormData
    formData.append('NewsCategoryId', newsCategoryId);
    formData.append('TitleEn', titleEn);
    formData.append('TitleAr', titleAr);
    formData.append('Name', titleEn);
    formData.append('NameAr', titleAr);
    formData.append('DescriptionEn', descriptionEn);
    formData.append('DescriptionAr', descriptionAr);

    // Append each attachment to FormData
    for (let i = 0; i < attachments.length; i++) {
      formData.append(`Attachments`, attachments[i], attachments[i].name);
    }

    return this.http
      .post<any>(`${this.apiUrl}/News/Add`, formData, {
        headers: this.getHeaders({ includeContentType: false }),
      })
      .pipe(
        catchError((error) => {
          console.error('Error adding news:', error);
          return throwError(error);
        })
      );
  }
  editNews(
    id: string,
    newsCategoryId: string,
    titleEn: string,
    titleAr: string,
    descriptionEn: string,
    descriptionAr: string,
    attachments: File[]
  ): Observable<any> {
    // Create FormData object to send multipart form data
    const formData = new FormData();

    // Append strings to FormData
    formData.append('Id', id);
    formData.append('NewsCategoryId', newsCategoryId);
    formData.append('TitleEn', titleEn);
    formData.append('TitleAr', titleAr);
    formData.append('Name', titleEn);
    formData.append('NameAr', titleAr);
    formData.append('DescriptionEn', descriptionEn);
    formData.append('DescriptionAr', descriptionAr);

    // Append each attachment to FormData
    for (let i = 0; i < attachments.length; i++) {
      formData.append(`Attachments`, attachments[i], attachments[i].name);
    }

    return this.http
      .post<any>(`${this.apiUrl}/News/Edit`, formData, {
        headers: this.getHeaders({ includeContentType: false }),
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  deleteNews(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/News/Delete?id=${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error deleting FAQ:', error);
          return throwError(error);
        })
      );
  }

  deleteAttachment(attachmentId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/News/DeleteAttachment?Id=${attachmentId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
