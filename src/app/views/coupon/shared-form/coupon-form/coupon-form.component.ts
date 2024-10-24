import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';


@Component({
    selector: 'app-coupon-form',
    templateUrl: './coupon-form.component.html',
    styleUrls: ['./coupon-form.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgIf, MatFormFieldModule, MatInputModule, MatDatepickerModule, TranslateModule]
})
export class CouponFormComponent {
  
  @Input() promoForm!: FormGroup;
  @Input() formSubmitted!: boolean;

  constructor(private fb: FormBuilder) {}

}
