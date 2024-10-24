import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root',
})
export class MarketingReportsService {
  constructor(
    private http: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  private get apiUrl(): string {
    return this.apiConfigService.getApiUrl();
  }

  private getHeaders(
    contentType = 'application/json',
    includeContentType = true
  ) {
    return this.apiConfigService.getHeaders(contentType, includeContentType);
  }

  getTopVendors(
    searchText: string,
    fromDate: string,
    toDate: string,
    page: number,
    pageSize: number
  ): Observable<ApiResponse> {
    const queryString = `searchText=${searchText}&fromDate=${fromDate}&toDate=${toDate}&page=${page}&pageSize=${pageSize}`;
    const url = `${this.apiUrl}/MarketingReports/GetTopVendors?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getTopCompanies(
    searchText: string,
    fromDate: string,
    toDate: string,
    page: number,
    pageSize: number
  ): Observable<ApiResponse> {
    const queryString = `searchText=${searchText}&fromDate=${fromDate}&toDate=${toDate}&page=${page}&pageSize=${pageSize}`;
    const url = `${this.apiUrl}/MarketingReports/GetTopCompanies?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getTopRatedVendors(
    searchText: string,
    fromDate: string,
    toDate: string,
    page: number,
    pageSize: number
  ): Observable<ApiResponse> {
    const queryString = `searchText=${searchText}&fromDate=${fromDate}&toDate=${toDate}&page=${page}&pageSize=${pageSize}`;
    const url = `${this.apiUrl}/MarketingReports/GetTopRatedVendors?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getNewRegisteredChart(
    fromDate: string,
    toDate: string
  ): Observable<ApiResponse> {
    const queryString = `dateFrom=${fromDate}&dateTo=${toDate}`;
    const url = `${this.apiUrl}/MarketingReports/NewRegisteredChart?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Certificate Link Error:', error);
        return throwError(error);
      })
    );
  }

  getRegisterUserWithLocationChart(
    fromDate: string,
    toDate: string
  ): Observable<ApiResponse> {
    const queryString = `dateFrom=${fromDate}&dateTo=${toDate}`;
    const url = `${this.apiUrl}/MarketingReports/RegisteredUserWithLocationChart?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Certificate Link Error:', error);
        return throwError(error);
      })
    );
  }

  getRegisterUserWithCategoryChart(
    fromDate: string,
    toDate: string
  ): Observable<ApiResponse> {
    const queryString = `dateFrom=${fromDate}&dateTo=${toDate}`;
    const url = `${this.apiUrl}/MarketingReports/RegisteredUserWithCategoryChart?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Certificate Link Error:', error);
        return throwError(error);
      })
    );
  }

  getProjectByCategoryChart(
    fromDate: string,
    toDate: string
  ): Observable<ApiResponse> {
    const queryString = `dateFrom=${fromDate}&dateTo=${toDate}`;
    const url = `${this.apiUrl}/MarketingReports/ProjectByCategoryChart?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Certificate Link Error:', error);
        return throwError(error);
      })
    );
  }
}
