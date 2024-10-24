import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
  selector: 'app-coupon-edit',
  templateUrl: './coupon-edit.component.html',
  styleUrls: ['./coupon-edit.component.scss'],
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
export class CouponEditComponent implements OnInit {
  couponId = '';
  couponEditForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private apiService: CouponApiService, // Update to your actual CouponApiService
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.couponEditForm = this.fb.group({
      promoCode: ['', Validators.required],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      discountPercentage: [0, Validators.required],
      maxDiscount: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.couponId = params.get('id') || '';

      this.apiService.getPromoById(this.couponId).subscribe(
        (response: any) => {
          const coupon = response.data;

          if (coupon) {
            this.couponEditForm.patchValue({
              promoCode: coupon.promoCode,
              validFrom: coupon.validFrom,
              validTo: coupon.validTo,
              discountPercentage: coupon.discountPrecentage,
            });
          }
        },
        (error) => {
          console.error('Error fetching coupon details for edit:', error);
        }
      );
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.couponEditForm.valid) {
      const promoCode = this.couponEditForm.value.promoCode;
      const validFrom = this.couponEditForm.value.validFrom;
      const validTo = this.couponEditForm.value.validTo;
      const discountPercentage = this.couponEditForm.value.discountPercentage;
      const maxDiscount = this.couponEditForm.value.maxDiscount;

      this.apiService
        .updatePromo(
          this.couponId,
          promoCode,
          validFrom,
          validTo,
          discountPercentage,
          maxDiscount
        )
        .subscribe(
          () => {
            this.router.navigate(['/admin/coupon/coupons']);
            this.openPopup();
          },
          (error) => {
            console.error('Error updating coupon:', error);
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
        message: 'EDIT_SUCCESS',
        button: 'CLOSE',
      },
    });
  }
}
