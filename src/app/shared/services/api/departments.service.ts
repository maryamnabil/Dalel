import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root',
})
export class DeptApiService {
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

  // Departments
  getDepartments(fromDate: string, toDate: string, searchText: string, pageIndex: number, pageSize: number): Observable<ApiResponse> {
 
    let apiUrl=`${this.apiUrl}/Department/Load?fromDate=${fromDate}&toDate=${toDate}&searchText=${searchText}&page=${pageIndex}&pageSize=${pageSize}`
    if(pageIndex==0)
    {
      apiUrl=`${this.apiUrl}/Department/Load?fromDate=${fromDate}&toDate=${toDate}&searchText=${searchText}`
    }
    return this.http.get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Department API Error:', error);
          return throwError(error);
        })
      );
  }

  getDepartmentById(departmentId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Department/GetById?Id=${departmentId}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get Department By ID API Error:', error);
          return throwError(error);
        })
      );
  }

  addDepartment(deptName: string, deptNameAr: string): Observable<any> {
    const departmentData = { name: deptName, nameAr: deptNameAr };

    return this.http.post<any>(`${this.apiUrl}/Department/Add`, departmentData, {  headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error adding department:', error);
          return throwError(error);
        })
      );
  }

  updateDepartment(deptName: string, deptNameAr: string, deptId: string): Observable<ApiResponse> {
    const departmentData = { name: deptName, nameAr: deptNameAr , id: deptId};
    return this.http.post<ApiResponse>(`${this.apiUrl}/Department/Update`, departmentData, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error updating department:', error);
          return throwError(error);
        })
      );
  }

  deleteDepartment(departmentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Department/Delete?Id=${departmentId}`, {  headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error deleting department:', error);
          return throwError(error);
        })
      );
  }

}
