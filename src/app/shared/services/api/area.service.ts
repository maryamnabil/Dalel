import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root',
})
export class AreaApiService {
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

  // Country
  getCountries(
    fromDate: string,
    toDate: string,
    searchText: string,
    pageIndex: number,
    pageSize: number
  ): Observable<ApiResponse> {
    const headers = this.getHeaders();

    return this.http
      .get<ApiResponse>(
        `${this.apiUrl}/Country/Load?fromDate=${fromDate}&toDate=${toDate}&searchText=${searchText}&page=${pageIndex}&pageSize=${pageSize}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Country API Error:', error);
          return throwError(error);
        })
      );
  }

  getCountryById(countryId: string): Observable<ApiResponse> {
    const headers = this.getHeaders();

    return this.http
      .get<ApiResponse>(`${this.apiUrl}/Country/GetById?Id=${countryId}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Get Country By ID API Error:', error);
          return throwError(error);
        })
      );
  }

  changeCountryStatus(
    countryId: string,
    status: number
  ): Observable<ApiResponse> {
    const headers = this.getHeaders();

    return this.http
      .get<ApiResponse>(
        `${this.apiUrl}/Country/ChangeStatus?Id=${countryId}&status=${status}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Change Country Status API Error:', error);
          return throwError(error);
        })
      );
  }

  addCountry(countryName: string, countryNameAr: string): Observable<any> {
    const headers = this.getHeaders();
    const countryData = { name: countryName, nameAr: countryNameAr };

    return this.http
      .post<any>(`${this.apiUrl}/Country/Add`, countryData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error adding Country:', error);
          return throwError(error);
        })
      );
  }

  updateCountry(
    countryName: string,
    countryNameAr: string,
    countryId: string
  ): Observable<ApiResponse> {
    const headers = this.getHeaders();
    const countryData = {
      name: countryName,
      nameAr: countryNameAr,
      id: countryId,
    };

    return this.http
      .post<ApiResponse>(
        `${this.apiUrl}/Country/Update?id=${countryId}`,
        countryData,
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Error updating department:', error);
          return throwError(error);
        })
      );
  }

  deleteCountry(countryId: number): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .delete<any>(`${this.apiUrl}/Country/Delete?Id=${countryId}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error deleting role:', error);
          return throwError(error);
        })
      );
  }

  // City
  getCity(
    countryId: string,
    fromDate: string,
    toDate: string,
    searchText: string,
    pageIndex: number,
    pageSize: number
  ): Observable<ApiResponse> {
    const headers = this.getHeaders();

    return this.http
      .get<ApiResponse>(
        `${this.apiUrl}/City/Load?countryId=${countryId}&fromDate=${fromDate}&toDate=${toDate}&searchText=${searchText}&page=${pageIndex}&pageSize=${pageSize}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('City API Error:', error);
          return throwError(error);
        })
      );
  }

  getCityById(cityId: string): Observable<ApiResponse> {
    const headers = this.getHeaders();

    return this.http
      .get<ApiResponse>(`${this.apiUrl}/City/GetById?Id=${cityId}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Get City By ID API Error:', error);
          return throwError(error);
        })
      );
  }

  changeCityStatus(cityId: string, status: number): Observable<ApiResponse> {
    const headers = this.getHeaders();

    return this.http
      .get<ApiResponse>(
        `${this.apiUrl}/City/ChangeStatus?Id=${cityId}&status=${status}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Change city Status API Error:', error);
          return throwError(error);
        })
      );
  }

  addCity(cities: any, countryId: string): Observable<any> {
    const headers = this.getHeaders();
    const cityData = {
      cities: cities,
      countryId: countryId,
    };

    return this.http
      .post<any>(`${this.apiUrl}/City/AddList`, cityData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error adding City:', error);
          return throwError(error);
        })
      );
  }

  updateCity(
    cityName: string,
    cityNameAr: string,
    cityId: string,
    countryId: string
  ): Observable<ApiResponse> {
    const headers = this.getHeaders();
    const cityData = {
      name: cityName,
      nameAr: cityNameAr,
      countryId: countryId,
    };

    return this.http
      .post<ApiResponse>(`${this.apiUrl}/City/Update?Id=${cityId}`, cityData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error updating City:', error);
          return throwError(error);
        })
      );
  }

  deleteCity(cityId: number): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .delete<any>(`${this.apiUrl}/City/Delete?Id=${cityId}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error deleting City:', error);
          return throwError(error);
        })
      );
  }

  // District
  getDistrict(
    cityId: string,
    fromDate: string,
    toDate: string,
    searchText: string,
    pageIndex: number,
    pageSize: number
  ): Observable<ApiResponse> {
    const headers = this.getHeaders();

    return this.http
      .get<ApiResponse>(
        `${this.apiUrl}/District/Load?cityId=${cityId}&fromDate=${fromDate}&toDate=${toDate}&searchText=${searchText}&page=${pageIndex}&pageSize=${pageSize}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('District API Error:', error);
          return throwError(error);
        })
      );
  }

  getDistrictById(districtId: string): Observable<ApiResponse> {
    const headers = this.getHeaders();

    return this.http
      .get<ApiResponse>(`${this.apiUrl}/District/GetById?Id=${districtId}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Get District By ID API Error:', error);
          return throwError(error);
        })
      );
  }

  addDistrict(districts: any, cityId: string): Observable<any> {
    const headers = this.getHeaders();
    const districtData = {
      districts: districts,
      cityId: cityId,
    };

    return this.http
      .post<any>(`${this.apiUrl}/District/AddList`, districtData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error adding District:', error);
          return throwError(error);
        })
      );
  }

  updateDistrict(
    districtName: string,
    districtNameAr: string,
    districtId: string,
    cityId: string
  ): Observable<ApiResponse> {
    const headers = this.getHeaders();
    const cityData = {
      name: districtName,
      nameAr: districtNameAr,
      cityId: cityId,
    };

    return this.http
      .post<ApiResponse>(
        `${this.apiUrl}/District/Update?Id=${districtId}`,
        cityData,
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Error updating City:', error);
          return throwError(error);
        })
      );
  }

  deleteDistrict(districtId: number): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .delete<any>(`${this.apiUrl}/District/Delete?Id=${districtId}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error deleting District:', error);
          return throwError(error);
        })
      );
  }
}
