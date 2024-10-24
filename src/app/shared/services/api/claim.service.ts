import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';
@Injectable({
  providedIn: 'root'
})
export class ClaimApiService  {
constructor(
  private http: HttpClient,
  private apiConfigService: ApiConfigService
){}
private get apiUrl(): string {
  return this.apiConfigService.getApiUrl();
}

private getHeaders(contentType = 'application/json') {
  return this.apiConfigService.getHeaders(contentType);
}

getClaims(fromDate: string, toDate: string, searchText: string, pageIndex: number, pageSize: number,isClosed:boolean | null): Observable<ApiResponse> {
  let ApiUrl=`${this.apiUrl}/Clam/GetAll?fromDate=${fromDate}&toDate=${toDate}&searchText=${searchText}&page=${pageIndex}&pageSize=${pageSize}`
  console.log(isClosed)
  if(isClosed!==null){
    ApiUrl+=`&isClosed=${isClosed}`
  }
  console.log(ApiUrl)
  return this.http.get<ApiResponse>(ApiUrl, { headers: this.getHeaders() })
    .pipe(
      catchError((error) => {
        console.error('Claim API Error:', error);
        return throwError(error);
      })
    );
}
getClaimById(ClaimId: number): Observable<ApiResponse> {
  return this.http.get<ApiResponse>(`${this.apiUrl}/Clam/GetById?id=${ClaimId}`, { headers: this.getHeaders() })
    .pipe(
      catchError((error) => {
        console.error('Get Claim By ID API Error:', error);
        return throwError(error);
      })
    );
}



ChangeStatus(ClaimId: number,isClosed:boolean): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(`${this.apiUrl}/Clam/ChangeStatus?id=${ClaimId}&isClosed=${isClosed}`,null,{ headers: this.getHeaders() })
    .pipe(
      catchError((error) => {
        console.error('Error updating Claim:', error);
        return throwError(error);
      })
    );
}


}

