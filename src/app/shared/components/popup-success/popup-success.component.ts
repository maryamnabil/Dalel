import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-popup-success',
    templateUrl: './popup-success.component.html',
    styleUrls: ['./popup-success.component.scss'],
    standalone: true,
    imports: [MatDialogModule, NgIf]
})
export class PopupSuccessComponent {
  constructor(
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopupSuccessComponent>
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  translatePopup(key: string): string {
    return this.translate.instant(key);
  }
}
