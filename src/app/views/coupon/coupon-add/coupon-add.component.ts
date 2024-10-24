import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { CouponApiService } from 'src/app/shared/services/api/coupon.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormActionsComponent } from '../../../shared/components/form-actions/form-actions.component';
import { CouponFormComponent } from '../shared-form/coupon-form/coupon-form.component';
import { BackwardComponent } from '../../../shared/components/backward/backward.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@Component({
  selector: 'app-coupon-add',
  templateUrl: './coupon-add.component.html',
  styleUrls: ['./coupon-add.component.scss'],
  standalone: true,
  imports: [
    BackwardComponent,
    FormsModule,
    ReactiveFormsModule,
    CouponFormComponent,
    FormActionsComponent,
    TranslateModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class CouponAddComponent {
  promoForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private promoApiService: CouponApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.promoForm = this.fb.group({
      promoCode: ['', Validators.required],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      discountPercentage: [0, Validators.required],
      maxDiscount: [0, Validators.required],
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.promoForm.valid) {
      const promoCode = this.promoForm.value.promoCode;
      const validFrom = this.promoForm.value.validFrom;
      const validTo = this.promoForm.value.validTo;
      const discountPercentage = this.promoForm.value.discountPercentage;
      const maxDiscount = this.promoForm.value.maxDiscount;

      this.promoApiService
        .addPromo(
          promoCode,
          validFrom,
          validTo,
          discountPercentage,
          maxDiscount
        )
        .subscribe(
          (response) => {
            if (response.statusCode === 200) {
              this.router.navigate(['/admin/coupon/coupons']);
              this.openPopup();
            }
          },
          (error) => {
            console.error('Error adding promo:', error);
          }
        );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/coupon/coupons']);
  }

  // Success Popup
  openPopup(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '400px',
      data: {
        title: 'SUCCESS',
        message: 'PROMO_ADD_SUCCESS',
        button: 'CLOSE',
      },
    });
  }
}
