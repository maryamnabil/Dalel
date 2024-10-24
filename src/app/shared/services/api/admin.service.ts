import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
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
  private getHeaders_MultiPart(
    contentType = 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
  ) {
    return this.apiConfigService.getHeaders(contentType);
  }

  getAdmins(
    pageIndex: number,
    pageSize: number,
    dateTo: string,
    dateFrom: string
  ): Observable<ApiResponse> {
    return this.http
      .get<ApiResponse>(
        `${this.apiUrl}/User/GetAdmins?page=${pageIndex}&pageSize=${pageSize}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
        { headers: this.getHeaders() }
      )
      .pipe(
        catchError((error) => {
          console.error('Admins API Error:', error);
          return throwError(error);
        })
      );
  }

  addAdmin(
    departmentId: string,
    roleId: string,
    adminName: string,
    adminEmail: string,
    adminPhoneCode: string,
    adminPhone: string,
    adminPass: string,
    adminPassConfirm: string
  ): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('DepartmentId', departmentId);
    formData.append('RoleId', roleId);
    formData.append('FullName', adminName);
    formData.append('Email', adminEmail);
    formData.append('PhoneCode', adminPhoneCode);
    formData.append('PhoneNumber', adminPhone);
    formData.append('Password', adminPass);
    formData.append('ConfirmPassword', adminPassConfirm);

    return this.http.post<any>(`${this.apiUrl}/User/CreateUser`, formData).pipe(
      catchError((error) => {
        console.error('Error adding Admin:', error);
        return throwError(error);
      })
    );
  }

  changeAdminStatus(adminId: string, status: string): Observable<ApiResponse> {
    const headers = this.getHeaders();
    const adminData = { UserId: adminId, status: status };

    return this.http
      .post<ApiResponse>(
        `${this.apiUrl}/User/ChangeStatus?UserId=${adminId}&status=${status}`,
        adminData,
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Error updating department:', error);
          return throwError(error);
        })
      );
  }

  getAdminDetails(userId: string): Observable<ApiResponse> {
    return this.http
      .get<ApiResponse>(
        `${this.apiUrl}/User/GetAdminDetails?userId=${userId}`,
        { headers: this.getHeaders() }
      )
      .pipe(
        catchError((error) => {
          console.error('Admins API Error:', error);
          return throwError(error);
        })
      );
  }

  ResetAdminPassword(
    userId: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<ApiResponse> {
    const headers = this.getHeaders();
    const adminData = { userId, newPassword, confirmPassword };
    console.log(adminData);

    return this.http
      .post<ApiResponse>(`${this.apiUrl}/User/ResetAdminPassword`, adminData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error ResetPassword:', error);
          return throwError(error);
        })
      );
  }

  deleteAdmin(userId: string): Observable<ApiResponse> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/User/DeleteAdmin?UserId=${userId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Admins API Error:', error);
          return throwError(error);
        })
      );
  }
  Updatedmin(
    userId: string,
    departmentId: string,
    roleId: string,
    adminName: string,
    adminEmail: string,
    adminPhoneCode: string,
    adminPhone: string
  ): Observable<any> {
    const formData = {
      userId: userId,
      departmentId: departmentId,
      roleId: roleId,
      fullName: adminName,
      email: adminEmail,
      phoneCode: adminPhoneCode,
      phoneNumber: adminPhone,
    };
    return this.http
      .post<any>(`${this.apiUrl}/User/EditAdmin`, formData, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error adding Admin:', error);
          return throwError(error);
        })
      );
  }

  getArtists(): Observable<ApiResponse> {
    const apiUrl = `${this.apiUrl}/User/GetUsers`;
    return this.http
      .get<ApiResponse>(apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Get All Announcements API Error:', error);
          return throwError(error);
        })
      );
  }
}
