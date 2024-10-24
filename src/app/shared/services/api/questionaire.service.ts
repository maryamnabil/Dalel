import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionaireApiService {
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
  getQuestionaire(
    fromDate: string,
    toDate: string,
    searchText: string
  ): Observable<ApiResponse> {
    const queryString = `fromDate=${fromDate}&toDate=${toDate}&text=${searchText}`;
    const url = `${this.apiUrl}/Question/Load?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('FAQ API Error:', error);
        return throwError(error);
      })
    );
  }
  getQuestionById(id: string): Observable<ApiResponse> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/Question/GetById?Id=${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Get Question By ID API Error:', error);
          return throwError(error);
        })
      );
  }

  // Add new FAQ
  addQuestion(
    questionStr: string,
    questionStrAr: string,
    answers: []
  ): Observable<any> {
    const questionData = { questionStr, questionStrAr, answers };

    return this.http
      .post<any>(`${this.apiUrl}/Question/Add`, questionData, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error adding Question:', error);
          return throwError(error);
        })
      );
  }

  // Update FAQ
  updateQuestion(
    question: string,
    questionAr: string,
    answers: [],
    questionId: string
  ): Observable<ApiResponse> {
    const editData = { question, questionAr, answers, questionId };

    return this.http
      .post<ApiResponse>(
        `${this.apiUrl}/Question/Update?id=${questionId}`,
        editData,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Error updating Question:', error);
          return throwError(error);
        })
      );
  }

  // Delete FAQ
  deleteQuestion(faqId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/Question/Delete?id=${faqId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error deleting Question:', error);
          return throwError(error);
        })
      );
  }
}
