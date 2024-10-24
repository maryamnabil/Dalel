import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { PopupConfirmComponent } from '../components/popup-confirm/popup-confirm.component';
import { PopupTextInputComponent } from '../components/popup-text-input/popup-text-input.component';
import { PopupSuccessComponent } from '../components/popup-success/popup-success.component';
import { ChatPopupComponent } from '../components/chat-popup/chat-popup.component';
import { PopupRechargeAccountComponent } from '../components/popup-recharge-account/popup-recharge-account.component';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private http: HttpClient, private dialog: MatDialog) {}

  convertUrlToFile(url: string): Observable<File> {
    return this.http
      .get(environment.assetsUrl + url, { responseType: 'blob' })
      .pipe(
        map((blob: Blob) => {
          const filename = this.extractFilenameFromUrl(url);
          return new File([blob], filename);
        }),
        catchError((error: any) => {
          console.error('Error fetching URL:', error);
          throw error;
        })
      );
  }

  extractFilenameFromUrl(url: string): string {
    const parts = url?.split('/');
    return parts[parts.length - 1];
  }

  openConfirmPopup(
    message: string,
    showIcon = true,
    confirmBtn = 'OK',
    cancelBtn = 'CANCEL',
    title?: string
  ) {
    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      width: '450px',
      data: {
        title: title,
        message: message,
        confirmButton: confirmBtn,
        cancelButton: cancelBtn,
      },
      autoFocus: false,
    });

    dialogRef.componentInstance.showIcon = showIcon;

    return dialogRef;
  }

  openTextInputPopup(
    title: string,
    inputLabel: string,
    confirmBtn = 'OK',
    cancelBtn = 'CANCEL'
  ) {
    const dialogRef = this.dialog.open(PopupTextInputComponent, {
      width: '450px',
      data: {
        title: title,
        inputLabel: inputLabel,
        confirmButton: confirmBtn,
        cancelButton: cancelBtn,
      },
      autoFocus: false,
    });
    return dialogRef;
  }

  openSuccessPopup(message: string, title = 'SUCCESS') {
    return this.dialog.open(PopupSuccessComponent, {
      width: '400px',
      data: {
        title: title,
        message: message,
        button: 'CLOSE',
      },
      autoFocus: false,
    });
  }

  openChatPopup(projectId: number) {
    return this.dialog.open(ChatPopupComponent, {
      width: '550px',
      maxWidth: '100%',
      height: '90%',
      autoFocus: false,
      data: {
        projectId: projectId,
      },
    });
  }

  openRechargeAccountPopup() {
    const dialogRef = this.dialog.open(PopupRechargeAccountComponent, {
      width: '450px',
      autoFocus: false,
    });
    return dialogRef;
  }
}
