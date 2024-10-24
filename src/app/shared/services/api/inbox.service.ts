import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';
@Injectable({
  providedIn: 'root'
})
export class InboxApiService {
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

  // API: Send Message to Inbox
  sendMessage(title: string, titleAr: string, message: string, messageAr: string, userIds: string[], sendToAllUsers: boolean): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Inbox/Send`;
    const messageData = {
      title,
      titleAr,
      message,
      messageAr,
      userIds,
      sendToAllUsers
    };
    console.log(messageData)
    return this.http.post<ApiResponse>(apiUrl, messageData, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Send Message to Inbox API Error:', error);
          return throwError(error);
        })
      );
  }

  // API: Get Message by ID
  getMessageById(messageId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Inbox/Get?id=${messageId}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get Message By ID API Error:', error);
          return throwError(error);
        })
      );
  }

  // API: Get All Messages in Inbox
  getAllMessages(searchText: string, fromDate: string, toDate: string, page: number, pageSize: number): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Inbox/GetAll?text=${searchText}&fromDate=${fromDate}&toDate=${toDate}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get All Messages in Inbox API Error:', error);
          return throwError(error);
        })
      );
  }
}