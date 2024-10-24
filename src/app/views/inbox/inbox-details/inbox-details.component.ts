import { DatePipe, NgFor } from '@angular/common';
import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from 'src/app/shared/services/translation.service';

@Component({
  selector: 'app-inbox-details',
  templateUrl: './inbox-details.component.html',
  styleUrls: ['./inbox-details.component.scss'],
  standalone: true,
  imports: [TranslateModule, DatePipe, NgFor],
})
export class InboxDetailsComponent {
  currentLanguage: string;
  inboxMessage: any; // Ensure that inboxMessage is properly initialized

  constructor(
    private translate: TranslationService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InboxDetailsComponent>
  ) {
    console.log('Received data:', data);
    this.inboxMessage = data.Message; // Access the 'Message' object within the data
    this.currentLanguage = this.translate.getCurrentLanguage();
  }

  closePopup() {
    this.dialogRef.close();
  }
}
