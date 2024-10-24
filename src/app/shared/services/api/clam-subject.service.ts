import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';
@Injectable({
  providedIn: 'root'
})
export class ClamSubjectApiService {

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

  // ClamSubjects
  getClamSubjects(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/ClamSubject/GetAll`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('ClamSubject API Error:', error);
          return throwError(error);
        })
      );
  }

  getClamSubjectById(ClamSubjectId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/ClamSubject/GetClamSubject?Id=${ClamSubjectId}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get ClamSubject By ID API Error:', error);
          return throwError(error);
        })
      );
  }

  addClamSubject(claimName: string, claimNameAr: string): Observable<any> {
    const ClamSubjectData = { name: claimName, nameAr: claimNameAr };

    return this.http.post<any>(`${this.apiUrl}/ClamSubject/AddClamSubject`, ClamSubjectData, { headers: this.getHeaders()})
      .pipe(
        catchError((error) => {
          console.error('Error adding ClamSubject:', error);
          return throwError(error);
        })
      );
  }

  updateClamSubject(claimName: string, claimNameAr: string, claimId: string): Observable<ApiResponse> {
    const ClamSubjectData = { name: claimName, nameAr: claimNameAr , id: claimId};
    return this.http.post<ApiResponse>(`${this.apiUrl}/ClamSubject/UpdateClamSubject`, ClamSubjectData, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error updating ClamSubject:', error);
          return throwError(error);
        })
      );
  }

  deleteClamSubject(ClamSubjectId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/ClamSubject/DeleteClamSubject?Id=${ClamSubjectId}`, {  headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error deleting ClamSubject:', error);
          return throwError(error);
        })
      );
  }

}

