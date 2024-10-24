import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root',
})
export class RoleApiService {
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

  // Roles
  getRoles(departmentId: string, pageIndex: number, pageSize: number, fromDate = '', toDate = '', searchText = ''): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Role/Load?departmentId=${departmentId}&fromDate=${fromDate}&toDate=${toDate}&text=${searchText}&page=${pageIndex}&pageSize=${pageSize}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Roles API Error:', error);
          return throwError(error);
        })
      );
  }

  getRoleById(roleId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Role/GetById?Id=${roleId}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get Department By ID API Error:', error);
          return throwError(error);
        })
      );
  }

  addRole(name: string, deptId: number, permissions: string[]): Observable<any> {
    const headers = this.getHeaders();
    const roleData = { roleName: name, departmentId: deptId, pagesIds: permissions };

    return this.http.post<any>(`${this.apiUrl}/Role/AddWithPermission`, roleData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error adding role:', error);
          return throwError(error);
        })
      );
  }

  updateRole(name: string, id: string, deptId: string): Observable<ApiResponse> {
    const roleData = { roleName: name, roleId: id, departmentId: deptId };
    return this.http.post<ApiResponse>(`${this.apiUrl}/Role/Update`, roleData, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error updating department:', error);
          return throwError(error);
        })
      );
  }

  UpdateWithPermission(name: string, id: string, deptId: string,pagesIds:[]): Observable<ApiResponse> {
    const roleData = { roleName: name, roleId: id, departmentId: deptId,pagesIds:pagesIds};
    console.log(roleData);
    return this.http.post<ApiResponse>(`${this.apiUrl}/Role/UpdateWithPermission`, roleData, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error updating department:', error);
          return throwError(error);
        })
      );
  }
  deleteRole(roleId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Role/Delete?Id=${roleId}`, {  headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error deleting role:', error);
          return throwError(error);
        })
      );
  }

}
