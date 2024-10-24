import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';

@Injectable({
  providedIn: 'root'
})
export class ManualApiService {
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
getManuals(fromDate: string, toDate: string, searchText: string, pageIndex: number, pageSize: number): Observable<ApiResponse> {

  return this.http.get<ApiResponse>(`${this.apiUrl}/Manual/Load?fromDate=${fromDate}&toDate=${toDate}&searchText=${searchText}&page=${pageIndex}&pageSize=${pageSize}`, { headers: this.getHeaders() })
    .pipe(
      catchError((error) => {
        console.error('manual API Error:', error);
        return throwError(error);
      })
    );
}

getmanualById(manualId: string): Observable<ApiResponse> {
  console.log(`${this.apiUrl}/Manual/GetById?Id=${manualId}`)
  return this.http.get<ApiResponse>(`${this.apiUrl}/Manual/GetById?Id=${manualId}`, { headers: this.getHeaders() })
    .pipe(
      catchError((error) => {
        console.error('Get manual By ID API Error:', error);
        return throwError(error);
      })
    );
}

addManual(url:string,Manualname: string, ManualNameAr: string,Manualdescription:string,ManualdescriptionAr:string): Observable<any> {
  const manualData = {url:url,name: Manualname, nameAr: ManualNameAr,description:Manualdescription,descriptionAr:ManualdescriptionAr};
  return this.http.post<any>(`${this.apiUrl}/Manual/Add`, manualData, {headers: this.getHeaders()})
    .pipe(
      catchError((error) => {
        console.error('Error adding manual:', error);
        return throwError(error);
      })
    );
}

updatemanual(ID:String,url:string,Manualname: string, ManualNameAr: string,Manualdescription:string,ManualdescriptionAr:string): Observable<ApiResponse> {
  const manualData = {id:ID,url:url,name: Manualname, nameAr: ManualNameAr,description:Manualdescription,descriptionAr:ManualdescriptionAr};
  
  return this.http.post<ApiResponse>(`${this.apiUrl}/Manual/Update`, manualData, { headers: this.getHeaders() })
    .pipe(
      catchError((error) => {
        console.error('Error updating manual:', error);
        return throwError(error);
      })
    );
}

deleteManual(manualId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/manual/Delete?Id=${manualId}`, {  headers: this.getHeaders() })
    .pipe(
      catchError((error) => {
        console.error('Error deleting manual:', error);
        return throwError(error);
      })
    );
}

}