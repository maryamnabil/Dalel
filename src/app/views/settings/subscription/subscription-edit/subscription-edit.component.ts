import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { SubscriptionApiService } from 'src/app/shared/services/api/subscription.service';

import { MatDialog } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { BackwardComponent } from 'src/app/shared/components/backward/backward.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { FormActionsComponent } from 'src/app/shared/components/form-actions/form-actions.component';

@Component({
  selector: 'app-subscription-edit',
  templateUrl: './subscription-edit.component.html',
  styleUrls: ['./subscription-edit.component.scss'],
  standalone: true,
  imports: [
    BackwardComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgIf,
    FormActionsComponent,
  ],
})
export class SubscriptionEditComponent {
  subscriptionForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private apiService: SubscriptionApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.subscriptionForm = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      price: ['', Validators.required],
      numberOfValidDays: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      console.log(params);
      const name = params.get('name') || '';
      const nameAr = params.get('nameAr') || '';
      const price = Number(params.get('price')) || '';
      const numberOfValidDays = Number(params.get('numberOfValidDays')) || '';

      this.subscriptionForm.patchValue({
        name: name,
        nameAr: nameAr,
        price: price,
        numberOfValidDays: numberOfValidDays,
      });
    });
  }

  submitForm(): void {
    this.formSubmitted = true;

    if (this.subscriptionForm.valid) {
      const { name, nameAr, price, numberOfValidDays } =
        this.subscriptionForm.value;

      this.apiService
        .addSubscription(name, nameAr, price, numberOfValidDays)
        .subscribe(
          () => {
            this.router.navigate(['/admin/settings/subscription']);
            this.openPopup();
          },
          (error) => {
            console.error('Error adding subscription:', error);
          }
        );
    }
  }
  cancel(): void {
    this.router.navigate(['/admin/settings/subscription']);
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

  numberOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      const isValid = /^\d+$/.test(control.value);
      return isValid ? null : { invalidNumber: { value: control.value } };
    };
  }
}
