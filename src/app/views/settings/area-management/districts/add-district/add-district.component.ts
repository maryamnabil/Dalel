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
import { DistrictFormComponent } from '../shared-form/district-form/district-form.component';

@Component({
  selector: 'app-add-district',
  templateUrl: './add-district.component.html',
  styleUrls: ['./add-district.component.scss'],
  standalone: true,
  imports: [
    BackwardComponent,
    FormsModule,
    ReactiveFormsModule,
    DistrictFormComponent,
    FormActionsComponent,
    TranslateModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class AddDistrictComponent {
  districtForm!: FormGroup;
  formSubmitted = false;
  cityId = '';
  constructor(
    private areaApiService: AreaApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.districtForm = this.fb.group({
      districts: this.fb.array([]),
    });
  }
  updateForm(form: any) {
    this.districtForm = form;
  }
  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.cityId = params.get('cityId') || '';
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.districtForm.valid) {
      this.areaApiService
        .addDistrict(this.districtForm.value.districts, this.cityId)
        .subscribe(
          (response) => {
            if (response.statusCode === 200) {
              this.router.navigate(['/admin/settings/area-management']);
              this.openPopup();
            }
          },
          (error) => {
            console.error('Error adding District:', error);
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
        message: 'DISTRICT_ADD_SUCCESS',
        button: 'CLOSE',
      },
    });
  }
}
