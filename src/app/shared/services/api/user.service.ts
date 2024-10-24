import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';
import { UserStatusEnum } from 'src/app/core/enums/user-status.enum';
import { CrStatusEnum } from 'src/app/core/enums/cr-status.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
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

  getUsers(
    status: UserStatusEnum,
    searchText: string,
    fromDate: string,
    toDate: string,
    page: number,
    pageSize: number
  ) {
    const url = `${this.apiUrl}/User/GetUsers?text=${searchText}&status=${status}&fromDate=${fromDate}&toDate=${toDate}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  loadCRs(
    status: CrStatusEnum,
    searchText: string,
    fromDate: string,
    toDate: string,
    page: number,
    pageSize: number
  ) {
    const url = `${this.apiUrl}/User/LoadCRs?text=${searchText}&status=${status}&fromDate=${fromDate}&toDate=${toDate}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  getUserDetails(userId: string) {
    const url = `${this.apiUrl}/User/GetUserDetails?userId=${userId}`;
    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  changeUserStatus(
    userId: string,
    status: UserStatusEnum,
    rejectionReason: string = ''
  ) {
    const url = `${this.apiUrl}/User/ChangeUserStatus?UserId=${userId}&status=${status}&rejectedReason=${rejectionReason}`;
    return this.http.post(url, {}, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  changeCRStatus(
    userId: string,
    status: CrStatusEnum,
    rejectionReason: string = ''
  ) {
    const url = `${this.apiUrl}/User/ChangeCRStatus?UserId=${userId}&status=${status}&rejectedReason=${rejectionReason}`;
    return this.http.post(url, {}, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }
}
