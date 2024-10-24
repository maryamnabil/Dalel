import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';
@Injectable({
  providedIn: 'root'
})
export class CouponApiService {

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

  // 1- Get Promos Usage Count
  getPromosUsageCount(dateFrom: string, dateTo: string): Observable<ApiResponse> {
    // dateFrom: string, dateTo: string
     const apiUrl = `${this.apiUrl}/Promo/GetPromosUseageCount?dateFrom=${dateFrom}&dateTo=${dateTo}`;
console.log(apiUrl)
    return this.http.get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get Promos Usage Count API Error:', error);
          return throwError(error);
        })
      );
  }

  // 2- Get Promo by ID
  getPromoById(promoId:string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Promo/GetById?Id=${promoId}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get Promo By ID API Error:', error);
          return throwError(error);
        })
      );
  }

  getPromos(searchText: string,fromDate: string, toDate: string,pageIndex: number, pageSize: number): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Promo/GetPromos?searchText=${searchText}&fromDate=${fromDate}&toDate=${toDate}&page=${pageIndex}&pageSize=${pageSize}`;
console.log(apiUrl)
    return this.http.get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get Promos API Error:', error);
          return throwError(error);
        })
      );
  }

  addPromo( promoCode: string, validFrom: string, validTo: string, discountPercentage: number, maxDiscount: number): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Promo/Add`;
    const promoData = {
      promoCode,
      validFrom,
      validTo,
      discountPrecentage: discountPercentage,
      maxDiscount
    };
    return this.http.post<ApiResponse>(apiUrl, promoData, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Add Promo API Error:', error);
          return throwError(error);
        })
      );
  }

  updatePromo(promoId: string, promoCode: string, validFrom: string, validTo: string, discountPercentage: number, maxDiscount: number): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/Promo/Update?id=${promoId}`;
    const promoData = {
      promoCode,
      validFrom,
      validTo,
      discountPrecentage:discountPercentage,
      maxDiscount
    };
    return this.http.post<ApiResponse>(apiUrl, promoData, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Update Promo API Error:', error);
          return throwError(error);
        })
      );
  }

  deletePromo(promoId:string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/Promo/Delete?Id=${promoId}`, { headers: this.getHeaders()})
      .pipe(
        catchError((error) => {
          console.error('Delete Promo API Error:', error);
          return throwError(error);
        })
      );
  }

  changeStatus(promoId:string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Promo/ChangeStatus?id=${promoId}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Change Status Promo API Error:', error);
          return throwError(error);
        })
      );
  }

}