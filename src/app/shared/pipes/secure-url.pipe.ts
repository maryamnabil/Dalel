import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'secureUrl',
  standalone: true,
})
export class SecureUrlPipe implements PipeTransform {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  transform(serverUrl: string): Observable<SafeUrl> {
    if (!serverUrl) {
      return of('/assets/images/dummy-user.jpg');
    }
    serverUrl = this.encodeUrl(serverUrl);
    return this.http
      .get(this.removeDuplicateSlashes(environment.assetsUrl + serverUrl), {
        responseType: 'blob',
      })
      .pipe(
        map((blob) => URL.createObjectURL(blob)),
        map((blobUrl) => this.sanitizer.bypassSecurityTrustUrl(blobUrl))
      );
  }

  private encodeUrl(url: string) {
    let parts = url.split('/');
    let encodedParts = parts.map((p) => encodeURIComponent(p));
    let output = encodedParts.join('/');
    return output;
  }

  private removeDuplicateSlashes(url: string): string {
    return url.replace(/([^:]\/)\/+/g, '$1');
  }
}
