import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-accounting-pop-up',
  templateUrl: './accounting-pop-up.component.html',
  styleUrls: ['./accounting-pop-up.component.scss'],
  standalone: true,
  imports: [MatDialogModule, FormsModule, TranslateModule, MatIconModule],
})
export class AccountingPopUpComponent implements OnInit {
  translatedMessage: string = '';
  translatedTitle: string = '';

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AccountingPopUpComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.translatedTitle = this.translatePopup(this.data.title);
    this.translatedMessage = this.translatePopup(this.data.message);
  }
  rejectionReason: string = '';

  closeDialog(): void {
    this.dialogRef.close();
  }

  translatePopup(key: string): string {
    return this.translate.instant(key);
  }
  // Success Popup
  onSave(): void {
    this.dialogRef.close(this.rejectionReason);
  }
}
