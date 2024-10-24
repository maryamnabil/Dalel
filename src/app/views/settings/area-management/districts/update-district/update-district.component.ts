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
import { DistrictFormComponent } from '../shared-form/district-form/district-form.component';
@Component({
  selector: 'app-update-district',
  templateUrl: './update-district.component.html',
  styleUrls: ['./update-district.component.scss'],
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
export class UpdateDistrictComponent {
  districtId = '';
  cityId = '';
  districtEditForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private apiService: AreaApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.districtEditForm = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.districtId = params.get('districtId') || '';
      this.cityId = params.get('cityId') || '';

      this.apiService.getDistrictById(this.districtId).subscribe(
        (response: any) => {
          const district = response.data;

          if (district) {
            this.districtEditForm.patchValue({
              name: district.name,
              nameAr: district.nameAr,
            });
          }
        },
        (error) => {
          console.error('Error fetching district details for edit:', error);
        }
      );
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.districtEditForm.valid) {
      const name = this.districtEditForm.value.name;
      const nameAr = this.districtEditForm.value.nameAr;
      this.apiService
        .updateDistrict(name, nameAr, this.districtId, this.cityId)
        .subscribe(
          () => {
            this.router.navigate(['/admin/settings/area-management']);
            this.openPopup();
          },
          (error) => {
            console.error('Error updating District:', error);
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