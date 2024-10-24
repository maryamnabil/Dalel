import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';
@Injectable({
  providedIn: 'root',
})
export class SubscriptionApiService {
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

  changeSubscriptionStatus(
    paintigId: number,
    subscriptionId: number,
    status: number,
    description: string
  ): Observable<ApiResponse> {
    const data = {
      paintigId,
      subscriptionId,
      status,
      description,
    };
    return this.http
      .post<ApiResponse>(
        `${this.apiUrl}/Subscription/ChangeSubscriptionStatus`,
        data,
        { headers: this.getHeaders() }
      )
      .pipe(
        catchError((error) => {
          console.error('Change Subscription Status API Error:', error);
          return throwError(error);
        })
      );
  }

  loadImage(ImageFile: string, ImageName: string): Observable<any> {
    const apiUrl = `${this.apiUrl + ImageFile + ImageName}`;
    console.log(apiUrl);
    return this.http.get<any>(apiUrl, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Load Image API Error:', error);
        return throwError(error);
      })
    );
  }

  loadSubscriptions(
    subscriptionType: number,
    subscriptionStatus: number,
    fromDate: string,
    toDate: string,
    text: string,
    page: number,
    pageSize: number
  ): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Subscription/Load?subscriptionType=${subscriptionType}&subscriptionStatus=${subscriptionStatus}&fromDate=${fromDate}&toDate=${toDate}&text=${text}&page=${page}&pageSize=${pageSize}`;
    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Load Subscriptions API Error:', error);
          return throwError(error);
        })
      );
  }

  editSubscription(price: number) {
    return this.http
      .post<ApiResponse>(
        `${this.apiUrl}/SubscribtionPackage/AddOrUpdateMainPackege`,
        { id: 1, price: price },
        { headers: this.getHeaders() }
      )
      .pipe(
        catchError((error) => {
          console.error('Add Subscription API Error:', error);
          return throwError(error);
        })
      );
  }
  addSubscription(
    name: string,
    nameAr: string,
    price: number,
    numberOfValidDays: number
  ): Observable<ApiResponse> {
    const data = {
      name,
      nameAr,
      price,
      numberOfValidDays,
    };
    return this.http
      .post<ApiResponse>(
        `${this.apiUrl}/SubscribtionPackage/AddOrUpdateMainPackege`,
        data,
        { headers: this.getHeaders() }
      )
      .pipe(
        catchError((error) => {
          console.error('Add Subscription API Error:', error);
          return throwError(error);
        })
      );
  }

  GetSubscriptionById(Id: number) {
    const apiUrl = `${this.apiUrl}/SubscribtionPackage/GetById?Id=${Id}`;
    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Load Subscriptions API By Id Error:', error);
          return throwError(error);
        })
      );
  }
}
