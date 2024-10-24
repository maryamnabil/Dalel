import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
    standalone: true,
    imports: [MatDialogModule, MatIconModule]
})
export class PopupComponent {

  constructor(
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopupComponent>
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  translatePopup(key: string): string {
    return this.translate.instant(key);
  }
}
