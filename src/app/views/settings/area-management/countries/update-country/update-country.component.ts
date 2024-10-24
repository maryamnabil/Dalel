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
import { AreaApiService } from 'src/app/shared/services/api/area.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormActionsComponent } from 'src/app/shared/components/form-actions/form-actions.component';
import { BackwardComponent } from 'src/app/shared/components/backward/backward.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CountryFormComponent } from '../shared-form/country-form/country-form.component';
@Component({
  selector: 'app-update-country',
  templateUrl: './update-country.component.html',
  styleUrls: ['./update-country.component.scss'],
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
export class UpdateCountryComponent {
  countryId = '';
  countryEditForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private apiService: AreaApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.countryEditForm = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.countryId = params.get('id') || '';

      this.apiService.getCountryById(this.countryId).subscribe(
        (response: any) => {
          const country = response.data;

          if (country) {
            this.countryEditForm.patchValue({
              name: country.name,
              nameAr: country.nameAr,
            });
          }
        },
        (error) => {
          console.error('Error fetching country details for edit:', error);
        }
      );
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.countryEditForm.valid) {
      const name = this.countryEditForm.value.name;
      const nameAr = this.countryEditForm.value.nameAr;
      this.apiService.updateCountry(name, nameAr, this.countryId).subscribe(
        () => {
          this.router.navigate(['/admin/settings/area-management']);
          this.openPopup();
        },
        (error) => {
          console.error('Error updating Country:', error);
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
