import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { formatDate } from '@angular/common';
import { ApiConfigService } from './api-config.service';
import { ApiResponse } from './api-response.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersGroupService {
  constructor(
    private http: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  private get apiUrl(): string {
    return this.apiConfigService.getApiUrl();
  }

  markOrdersWithIssue(orderIds: string[], comment: string): Observable<any> {
    const url = `${this.apiUrl}/OrdersGroup/MarkTermssWithIssue?comment=${comment}`;
    return this.http
      .post<any>(url, orderIds, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Orders Group API Error:', error);
          return throwError(error);
        })
      );
  }

  ConfirmPaidByOrders(orderIds: string[]): Observable<any> {
    const url = `${this.apiUrl}/OrdersGroup/ConfirmPaidByOrders`;
    return this.http
      .post<any>(url, orderIds, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Orders Group API Error:', error);
          return throwError(error);
        })
      );
  }
  RemoveIssueFromOrders(orderIds: string[]): Observable<any> {
    const url = `${this.apiUrl}/OrdersGroup/RemoveIssueFromOrders`;
    return this.http
      .post<any>(url, orderIds, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Orders Group API Error:', error);
          return throwError(error);
        })
      );
  }

  ExportByOrders(orderIds: string[]): Observable<any> {
    const url = `${this.apiUrl}/OrdersGroup/ExportByOrders`;
    return this.http
      .post(url, orderIds, { headers: this.getHeaders(), responseType: 'blob' })
      .pipe(
        catchError((error) => {
          console.error('Orders Group API Error:', error);
          return throwError(error);
        })
      );
  }

  getSolvedOrders(
    fromDate: string,
    toDate: string,
    text: string,
    pageIndex: number,
    pageSize: number
  ): Observable<any> {
    let url = `${this.apiUrl}/OrdersGroup/GetSolvedTerms?page=${pageIndex}&pageSize=${pageSize}`;
    if (fromDate !== '') {
      url += `&fromDate=${fromDate}`;
    }
    if (toDate !== '') {
      url += `&toDate=${toDate}`;
    }
    if (text !== '') {
      url += `&text=${text}`;
    }

    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Get Solved Orders API Error:', error);
        return throwError(error);
      })
    );
  }

  getOrdersInGroup(
    pageIndex: number,
    pageSize: number,
    fromDate: string,
    toDate: string,
    isPaid: string,
    text: string,
    groupId: string,
    haIssue: string
  ): Observable<any> {
    const url = `${this.apiUrl}/OrdersGroup/GetGroupOrders?groupId=${groupId}&fromDate=${fromDate}&toDate=${toDate}&isPaid=${isPaid}&text=${text}&page=${pageIndex}&pageSize=${pageSize}&haIssue${haIssue}`;
    console.log(url);
    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Orders Group API Error:', error);
        return throwError(error);
      })
    );
  }

  getOrders(
    pageIndex: number,
    pageSize: number,
    fromDate: string,
    toDate: string,
    text: string
  ): Observable<any> {
    const url = `${this.apiUrl}/Accounting/PaySlip?fromDate=${fromDate}&toDate=${toDate}&text=${text}&page=${pageIndex}&pageSize=${pageSize}`;
    console.log(url);
    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Orders Group API Error:', error);
        return throwError(error);
      })
    );
  }
  private getHeaders(
    contentType = 'application/json',
    includeContentType = true
  ) {
    return this.apiConfigService.getHeaders(contentType, includeContentType);
  }

  getOrderGroups(
    pageIndex: number,
    pageSize: number,
    fromDate: string,
    toDate: string,
    groupName: string,
    isPaid: boolean,
    text: string
  ): Observable<ApiResponse> {
    const queryParams = `fromDate=${fromDate}&toDate=${toDate}&groupName=${groupName}&isPaid=${isPaid}&text=${text}&page=${pageIndex}&pageSize=${pageSize}`;
    const url = `${this.apiUrl}/GetOrderGroups?${queryParams}`;
    console.log(url); // For debugging, you can remove this line later

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Order Groups API Error:', error);
        return throwError(error);
      })
    );
  }

  getGroups(
    pageIndex: number,
    pageSize: number,
    fromDate: string,
    toDate: string,
    groupName: string,
    isPaid: string,
    text: string
  ): Observable<any> {
    const url = `${this.apiUrl}/OrdersGroup/GetOrderGroups?fromDate=${fromDate}&toDate=${toDate}&groupName=${groupName}&isPaid=${isPaid}&text=${text}&page=${pageIndex}&pageSize=${pageSize}`;
    console.log(url);
    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Order Groups API Error:', error);
        return throwError(error);
      })
    );
  }

  getOrdersWithProblem(
    fromDate: string,
    toDate: string,
    text: string,
    pageIndex: number,
    pageSize: number
  ): Observable<any> {
    console.log(fromDate);
    let url = `${this.apiUrl}/OrdersGroup/GetOrdersWithProblem?page=${pageIndex}&pageSize=${pageSize}`;
    if (fromDate !== '') {
      url += `&fromDate=${fromDate}`;
    }
    if (toDate !== '') {
      url += `&toDate=${toDate}`;
    }
    if (text !== '') {
      url += `&text=${text}`;
    }

    console.log(url);
    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Get Orders With Problem API Error:', error);
        return throwError(error);
      })
    );
  }

  addGroup(groupName: string, ordersIds: string[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('GroupName', groupName);
    ordersIds.forEach((id) => formData.append('PaymentTermIds', id));

    return this.http
      .post<any>(`${this.apiUrl}/OrdersGroup/AddGroup`, formData, {
        headers: this.getHeaders('', false),
      })
      .pipe(
        catchError((error) => {
          console.error('Error adding Group:', error);
          return throwError(error);
        })
      );
  }
}
