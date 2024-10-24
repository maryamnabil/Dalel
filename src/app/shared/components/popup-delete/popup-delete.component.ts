import { Component, Inject, Input } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './popup-delete.component.html',
  styleUrls: ['./popup-delete.component.scss'],
  standalone: true,
  imports: [MatDialogModule],
})
export class PopupDeleteComponent {
  @Input() showIcon = false;

  constructor(
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopupDeleteComponent>
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
