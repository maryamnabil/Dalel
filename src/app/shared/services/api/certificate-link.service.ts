import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response.model';
import { ApiConfigService } from '../api-config.service';
import { CertificateLinkType } from 'src/app/core/enums/certificate-link-type.enum';

@Injectable({
  providedIn: 'root',
})
export class CertificateLinkService {
  constructor(
    private http: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  private get apiUrl(): string {
    return this.apiConfigService.getApiUrl();
  }

  private getHeaders(
    contentType = 'application/json',
    includeContentType = true
  ) {
    return this.apiConfigService.getHeaders(contentType, includeContentType);
  }

  getCertificateLinks(
    searchText: string,
    page: number,
    pageSize: number
  ): Observable<ApiResponse> {
    const queryString = `text=${searchText}&page=${page}&pageSize=${pageSize}`;
    const url = `${this.apiUrl}/CertificateLinks/Load?${queryString}`;

    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Certificate Link Error:', error);
        return throwError(error);
      })
    );
  }

  addCertificateLink(
    certificateTypeId: number,
    imageTemplate: File,
    imageProduct: File,
    isPortrait: boolean
  ): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('CertificateTypeId', certificateTypeId.toString());
    formData.append('ImageTemplete', imageTemplate);
    formData.append('ImageProduct', imageProduct);
    formData.append(
      'CertificateLinkType',
      isPortrait ? CertificateLinkType.Portrait : CertificateLinkType.Landscape
    );
    return this.http
      .post<any>(`${this.apiUrl}/CertificateLinks/Add`, formData, {
        headers: this.getHeaders('multipart/form-data', false),
      })
      .pipe(
        catchError((error) => {
          console.error('Error adding certificate link:', error);
          return throwError(error);
        })
      );
  }

  deleteCertificateLink(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/CertificateLinks/Delete?id=${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error deleting certificate link:', error);
          return throwError(error);
        })
      );
  }
}
