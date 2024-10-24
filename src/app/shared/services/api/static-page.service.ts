import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';


@Injectable({
  providedIn: 'root'
})
export class StaticPageService {

constructor(
  private http: HttpClient,
  private apiConfigService: ApiConfigService
) {}

private get apiUrl(): string {
  return this.apiConfigService.getApiUrl();
}

private getHeaders({contentType = 'multipart/form-data', includeContentType = true} = {}) {
  return this.apiConfigService.getHeaders(contentType, includeContentType);
}


loadPage(pageName: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/StaticPage/Load?pageName=${pageName}`,{headers: this.getHeaders({contentType: 'text/plain'})})
    .pipe(
      catchError((error) => {
        console.error('Load Page API Error:', error);
        return throwError(error);
      })
    );
}

addPage(pageName: string, content: string, contentAr: string,file:File): Observable<ApiResponse> {
  const formData: FormData = new FormData();
  formData.append('PageName', pageName);
  formData.append('Content', content);
  formData.append('ContentAr', contentAr);
  if(file){
    formData.append('AttachmentsFiles', file);
  }

  formData.forEach((value: FormDataEntryValue, key: string) => {
    console.log(key, value);
  });
  return this.http.post<any>(`${this.apiUrl}/StaticPage/Add`, formData, { headers: this.getHeaders({includeContentType: false})})
    .pipe(
      catchError((error) => {
        console.error('Add Page API Error:', error);
        return throwError(error);
      })
    );
}

updatePage(id: string,pageName: string, content: string, contentAr: string,file:File): Observable<any> 
{
  const formData: FormData = new FormData();
  formData.append('id',id);
  formData.append('PageName', pageName);
  formData.append('Content', content);
  formData.append('ContentAr', contentAr);
  if(file){
    formData.append('AttachmentsFiles', file);
  }

  formData.forEach((value: FormDataEntryValue, key: string) => {
    console.log(key, value);
  });
  return this.http.post<any>(`${this.apiUrl}/StaticPage/Update`, formData, { headers: this.getHeaders({includeContentType: false}) })
    .pipe(
      catchError((error) => {
        console.error('Update Page API Error:', error);
        return throwError(error);
      })
    );
}


deleteAttachment(attachmentId: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/StaticPage/DeleteAttachment?Id=${attachmentId}`, { headers: this.getHeaders({contentType: 'text/plain'}) })
    .pipe(
      catchError((error) => {
        console.error('Delete Attachment API Error:', error);
        return throwError(error);
      })
    );
}
  
}
