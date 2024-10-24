import { Component } from '@angular/core';
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
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss'],
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
export class AddCityComponent {
  cityForm!: FormGroup;
  formSubmitted = false;
  countryId = '';
  constructor(
    private areaApiService: AreaApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.cityForm = this.fb.group({
      cities: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.countryId = params.get('countryId') || '';
    });
  }

  updateForm(form: any) {
    this.cityForm = form;
  }

  submitForm(): void {
    this.formSubmitted = true;
    console.log(this.cityForm);
    if (this.cityForm.valid) {
      this.areaApiService
        .addCity(this.cityForm.value.cities, this.countryId)
        .subscribe(
          (response) => {
            if (response.statusCode === 200) {
              this.router.navigate(['/admin/settings/area-management']);
              this.openPopup();
            }
          },
          (error) => {
            console.error('Error adding City:', error);
          }
        );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/settings/area-management/']);
  }

  // Success Popup
  openPopup(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '400px',
      data: {
        title: 'SUCCESS',
        message: 'CITY_ADD_SUCCESS',
        button: 'CLOSE',
      },
    });
  }
}
