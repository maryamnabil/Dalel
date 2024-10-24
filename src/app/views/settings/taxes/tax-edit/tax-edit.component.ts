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

import { TaxesApiService } from 'src/app/shared/services/api/taxes.service';

import { MatDialog } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { BackwardComponent } from 'src/app/shared/components/backward/backward.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { FormActionsComponent } from 'src/app/shared/components/form-actions/form-actions.component';

@Component({
  selector: 'app-tax-edit',
  templateUrl: './tax-edit.component.html',
  styleUrls: ['./tax-edit.component.scss'],
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
export class TaxEditComponent {
  vatRateValue = '';
  vatEditForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private apiService: TaxesApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.vatEditForm = this.fb.group({
      vatRate: ['', [Validators.required, this.numberOnlyValidator()]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.vatRateValue = params.get('value') || '';
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.vatEditForm.valid) {
      const vatValue = this.vatEditForm.value.vatRate;
      this.apiService.updateTaxes(vatValue).subscribe(
        () => {
          this.router.navigate(['/admin/settings/taxes']);
          this.openPopup();
        },
        (error) => {
          console.error('Error updating department:', error);
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/settings/taxes']);
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
