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

import { MatDialog } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { BackwardComponent } from 'src/app/shared/components/backward/backward.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { FormActionsComponent } from 'src/app/shared/components/form-actions/form-actions.component';
import { CommissionFeeApiService } from 'src/app/shared/services/api/commission-fee.service';

@Component({
  selector: 'app-commission-fee-edit',
  templateUrl: './commission-fee-edit.component.html',
  styleUrls: ['./commission-fee-edit.component.scss'],
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
export class CommissionFeeEditComponent {
  commissionFeeValue = '';
  commissionFeeEditForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private apiService: CommissionFeeApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.commissionFeeEditForm = this.fb.group({
      commissionFee: ['', [Validators.required, this.numberOnlyValidator()]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.commissionFeeValue = params.get('value') || '';
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.commissionFeeEditForm.valid) {
      const commissionFeeValue = this.commissionFeeEditForm.value.commissionFee;
      this.apiService.updateCommissionFee(commissionFeeValue).subscribe(
        () => {
          this.router.navigate(['/admin/settings/commission-fee']);
          this.openPopup();
        },
        (error) => {
          console.error('Error updating department:', error);
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/settings/commission-fee']);
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
