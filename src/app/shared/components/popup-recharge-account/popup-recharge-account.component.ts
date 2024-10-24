import { NgIf } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popup-recharge-account',
  standalone: true,
  imports: [MatDialogModule, NgIf, FormsModule, TranslateModule],
  templateUrl: './popup-recharge-account.component.html',
  styleUrls: ['./popup-recharge-account.component.scss'],
})
export class PopupRechargeAccountComponent {
  @Input() showIcon = true;
  description: string;
  amount: number;
  showValidation: boolean;

  constructor(
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopupRechargeAccountComponent>
  ) {}

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    if (!this.description || !this.amount) {
      this.showValidation = true;
      return;
    }
    this.showValidation = false;
    this.dialogRef.close({ amount: this.amount, desc: this.description });
  }

  translatePopup(key: string): string {
    return this.translate.instant(key);
  }
}
