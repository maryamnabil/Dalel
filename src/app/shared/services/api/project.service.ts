import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';
import { ProjectStatus } from 'src/app/core/enums/project-status.enum';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
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

  loadProjects(
    status: ProjectStatus | '',
    searchText: string,
    fromDate: string,
    toDate: string,
    page: number,
    pageSize: number,
    userId = ''
  ) {
    const url = `${this.apiUrl}/Project/Load?searchText=${searchText}&projectStatus=${status}&fromDate=${fromDate}&toDate=${toDate}&userId=${userId}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  loadPaymentHistory(
    projectId: number,
    page: number,
    pageSize: number,
    searchText = '',
    fromDate = '',
    toDate = ''
  ) {
    const url = `${this.apiUrl}/Project/LoadPaymentHistory?searchText=${searchText}&fromDate=${fromDate}&toDate=${toDate}&projectId=${projectId}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }
  getById(id: string) {
    const url = `${this.apiUrl}/Project/GetById?id=${id}`;
    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  loadCompanyRatings(
    searchText: string,
    fromDate: string,
    toDate: string,
    page: number,
    pageSize: number
  ) {
    const url = `${this.apiUrl}/Project/LoadCompanyRatings?searchText=${searchText}&fromDate=${fromDate}&toDate=${toDate}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }
}
