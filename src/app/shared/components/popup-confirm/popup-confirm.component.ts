import { NgIf } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popup-confirm',
  standalone: true,
  imports: [MatDialogModule, NgIf],
  templateUrl: './popup-confirm.component.html',
  styleUrls: ['./popup-confirm.component.scss'],
})
export class PopupConfirmComponent {
  @Input() showIcon = true;

  constructor(
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopupConfirmComponent>
  ) {}

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  translatePopup(key: string): string {
    return this.translate.instant(key);
  }
}
