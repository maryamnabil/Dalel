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
import { AreaApiService } from 'src/app/shared/services/api/area.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormActionsComponent } from 'src/app/shared/components/form-actions/form-actions.component';
import { BackwardComponent } from 'src/app/shared/components/backward/backward.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CountryFormComponent } from '../shared-form/country-form/country-form.component';

@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.scss'],
  standalone: true,
  imports: [
    BackwardComponent,
    FormsModule,
    ReactiveFormsModule,
    CountryFormComponent,
    FormActionsComponent,
    TranslateModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class AddCountryComponent {
  countryForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private areaApiService: AreaApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.countryForm = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.countryForm.valid) {
      const name = this.countryForm.value.name;
      const nameAr = this.countryForm.value.nameAr;
      this.areaApiService.addCountry(name, nameAr).subscribe(
        (response) => {
          if (response.statusCode === 200) {
            this.router.navigate(['/admin/settings/area-management']);
            this.openPopup();
          }
        },
        (error) => {
          console.error('Error adding Country:', error);
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
        message: 'COUNTRY_ADD_SUCCESS',
        button: 'CLOSE',
      },
    });
  }
}
