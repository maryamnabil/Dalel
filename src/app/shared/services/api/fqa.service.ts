import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root'
})
export class FQAApiService {

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
  getFAQs(fromDate: string, toDate: string, searchText: string): Observable<ApiResponse> {
    const queryString = `fromDate=${fromDate}&toDate=${toDate}&text=${searchText}`;
    const url = `${this.apiUrl}/FQA/GetFQAs?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('FAQ API Error:', error);
          return throwError(error);
        })
      );
  }
  getFAQById(faqId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/FQA/GetById?Id=${faqId}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get FAQ By ID API Error:', error);
          return throwError(error);
        })
      );
  }

  // Add new FAQ
  addFAQ(question: string, answer: string, questionAr: string,answerAr: string): Observable<any> {
    const faqData = { question, answer, questionAr, answerAr };

    return this.http.post<any>(`${this.apiUrl}/FQA/Add`, faqData, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error adding FAQ:', error);
          return throwError(error);
        })
      );
  }

  // Update FAQ
  updateFAQ(question: string, answer: string, questionAr: string, answerAr: string, faqId: string): Observable<ApiResponse> {
    const faqData = { question, answer, questionAr, answerAr};

    return this.http.post<ApiResponse>(`${this.apiUrl}/FQA/Update?id=${faqId}`, faqData, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error updating FAQ:', error);
          return throwError(error);
        })
      );
  }

  // Delete FAQ
  deleteFAQ(faqId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/FQA/Delete?id=${faqId}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error deleting FAQ:', error);
          return throwError(error);
        })
      );
  }
}