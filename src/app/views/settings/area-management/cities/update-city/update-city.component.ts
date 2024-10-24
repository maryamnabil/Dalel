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
import { CityFormComponent } from '../shared-form/city-form/city-form.component';
@Component({
  selector: 'app-update-city',
  templateUrl: './update-city.component.html',
  styleUrls: ['./update-city.component.scss'],
  standalone: true,
  imports: [
    BackwardComponent,
    FormsModule,
    ReactiveFormsModule,
    CityFormComponent,
    FormActionsComponent,
    TranslateModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class UpdateCityComponent {
  cityId = '';
  countryId = '';
  cityEditForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private apiService: AreaApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.cityEditForm = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.cityId = params.get('cityId') || '';
      this.countryId = params.get('countryId') || '';

      this.apiService.getCityById(this.cityId).subscribe(
        (response: any) => {
          const city = response.data;

          if (city) {
            this.cityEditForm.patchValue({
              name: city.name,
              nameAr: city.nameAr,
            });
          }
        },
        (error) => {
          console.error('Error fetching city details for edit:', error);
        }
      );
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.cityEditForm.valid) {
      const name = this.cityEditForm.value.name;
      const nameAr = this.cityEditForm.value.nameAr;
      this.apiService
        .updateCity(name, nameAr, this.cityId, this.countryId)
        .subscribe(
          () => {
            this.router.navigate(['/admin/settings/area-management']);
            this.openPopup();
          },
          (error) => {
            console.error('Error updating City:', error);
          }
        );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/settings/area-management']);
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
