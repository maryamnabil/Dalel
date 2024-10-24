import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';
@Injectable({
  providedIn: 'root',
})
export class AccountingService {
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

  getVisitorsChartData(
    dateFrom: string,
    dateTo: string
  ): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Accounting/GetVisitorsChart?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    console.log(apiUrl);
    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get Visitors Chart API Error:', error);
          return throwError(error);
        })
      );
  }

  getCustomersChartData(
    dateFrom: string,
    dateTo: string,
    culture: string
  ): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Accounting/GetCustomersChart?dateFrom=${dateFrom}&dateTo=${dateTo}&culture=${culture}`;
    console.log(apiUrl);

    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get Customers Chart API Error:', error);
          return throwError(error);
        })
      );
  }

  getPendingOrdersForArtAssociation(
    fromDate: string,
    toDate: string
  ): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Accounting/PendingOrdersForArtAssociation?fromDate=${fromDate}&toDate=${toDate}`;
    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error(
            'Get Pending Orders For Art Association API Error:',
            error
          );
          return throwError(error);
        })
      );
  }

  getTodayIncome(fromDate: string, toDate: string): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Accounting/TodayIncome?fromDate=${fromDate}&toDate=${toDate}`;
    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get Today Income For  API Error:', error);
          return throwError(error);
        })
      );
  }

  getPendingOrdersForSaudiAuthority(
    fromDate: string,
    toDate: string
  ): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Accounting/PendingOrdersForSaudiAuthority?fromDate=${fromDate}&toDate=${toDate}`;
    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error(
            'Get Pending Orders For Saudi Authority API Error:',
            error
          );
          return throwError(error);
        })
      );
  }

  getRejectedOrdersForSaudiAuthority(
    fromDate: string,
    toDate: string
  ): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Accounting/RejectedOrdersForSaudiAuthority?fromDate=${fromDate}&toDate=${toDate}`;
    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error(
            'Get Rejected Orders For Saudi Authority API Error:',
            error
          );
          return throwError(error);
        })
      );
  }

  getRejectedOrdersForArtAssociation(
    fromDate: string,
    toDate: string
  ): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Accounting/RejectedOrdersForArtAssociation?fromDate=${fromDate}&toDate=${toDate}`;
    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error(
            'Get Rejected Orders For Art Association API Error:',
            error
          );
          return throwError(error);
        })
      );
  }

  getNumberOfPhotosInGallery(
    fromDate: string,
    toDate: string
  ): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Accounting/NumberOfPhotosInGallery?fromDate=${fromDate}&toDate=${toDate}`;
    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get Number of Photos In Gallery API Error:', error);
          return throwError(error);
        })
      );
  }

  getNumberOfResalePermissions(
    fromDate: string,
    toDate: string
  ): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Accounting/NumberOfResalePermissions?fromDate=${fromDate}&toDate=${toDate}`;
    console.log(apiUrl);

    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get Number of Resale Permissions API Error:', error);
          return throwError(error);
        })
      );
  }
  getTotalFees(fromDate: string, toDate: string): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Accounting/TotalFees?fromDate=${fromDate}&toDate=${toDate}`;
    console.log(apiUrl);

    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get TotalFees API Error:', error);
          return throwError(error);
        })
      );
  }

  getTotalEarningWithoutVat(
    fromDate: string,
    toDate: string
  ): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Accounting/TotalEarningWithoutVat?fromDate=${fromDate}&toDate=${toDate}`;
    console.log(apiUrl);

    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get TotalFees API Error:', error);
          return throwError(error);
        })
      );
  }

  getotalCommision(fromDate: string, toDate: string): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Accounting/TotalCommision?fromDate=${fromDate}&toDate=${toDate}`;
    console.log(apiUrl);
    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get TotalFees API Error:', error);
          return throwError(error);
        })
      );
  }

  getTotalVat(fromDate: string, toDate: string): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Accounting/TotalVat?fromDate=${fromDate}&toDate=${toDate}`;
    console.log(apiUrl);

    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get TotalFees API Error:', error);
          return throwError(error);
        })
      );
  }
  PaymentsByMonths(year: string): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Accounting/PaymentsByMonths?year=${year}`;
    console.log(apiUrl);
    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get PaymentsByMonths API Error:', error);
          return throwError(error);
        })
      );
  }
}
