import { DatePipe, NgFor } from '@angular/common';
import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from 'src/app/shared/services/translation.service';
@Component({
  selector: 'app-announcement-detail',
  templateUrl: './announcement-detail.component.html',
  styleUrls: ['./announcement-detail.component.scss'],
  standalone: true,
  imports: [TranslateModule, DatePipe, NgFor],
})
export class AnnouncementDetailComponent {
  currentLanguage: string;
  announcement: any;

  constructor(
    private translate: TranslationService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AnnouncementDetailComponent>
  ) {
    console.log('Received data:', data);
    this.announcement = data.Announcement; // Access the 'Announcement' object within the data
    this.currentLanguage = this.translate.getCurrentLanguage();
  }

  closePopup() {
    this.dialogRef.close();
  }
}
