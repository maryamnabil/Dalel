import { NgIf } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popup-text-input',
  standalone: true,
  imports: [MatDialogModule, NgIf, FormsModule],
  templateUrl: './popup-text-input.component.html',
  styleUrls: ['./popup-text-input.component.scss'],
})
export class PopupTextInputComponent {
  @Input() showIcon = true;
  inputText: string;
  showValidation: boolean;

  constructor(
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopupTextInputComponent>
  ) {}

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(inputText: string): void {
    if (!inputText) {
      this.showValidation = true;
      return;
    }
    this.showValidation = false;
    this.dialogRef.close(inputText);
  }

  translatePopup(key: string): string {
    return this.translate.instant(key);
  }
}
