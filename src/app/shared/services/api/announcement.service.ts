import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementApiService{

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

  // API: Send Announcement
  sendAnnouncement(subject: string, message: string, userIds: string[], sendToAllUsers: boolean): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Announcement/Send`;
    const announcementData = {
      subject,
      message,
      userIds,
      sendToAllUsers
    };
    return this.http.post<ApiResponse>(apiUrl, announcementData, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Send Announcement API Error:', error);
          return throwError(error);
        })
      );
  }
  
  // API: Get Announcement by ID
  getAnnouncementById(announcementId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Announcement/Get?announcementId=${announcementId}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get Announcement By ID API Error:', error);
          return throwError(error);
        })
      );
  }

  // API: Get All Announcements
  getAllAnnouncements(searchText: string, fromDate: string, toDate: string, page: number, pageSize: number): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Announcement/GetAll?text=${searchText}&fromDate=${fromDate}&toDate=${toDate}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get All Announcements API Error:', error);
          return throwError(error);
        })
      );
  }
}
