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

import { DeptApiService } from 'src/app/shared/services/api/departments.service';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';
import { DepartmentFormComponent } from '../../shared-forms/department-form/department-form.component';
import { BackwardComponent } from '../../../../shared/components/backward/backward.component';

@Component({
  selector: 'app-department-add',
  templateUrl: './department-add.component.html',
  styleUrls: ['./department-add.component.scss'],
  standalone: true,
  imports: [
    BackwardComponent,
    FormsModule,
    ReactiveFormsModule,
    DepartmentFormComponent,
    FormActionsComponent,
    TranslateModule,
    MatDialogModule,
  ],
})
export class DepartmentAddComponent {
  deptAddForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private apiService: DeptApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.deptAddForm = this.fb.group({
      departmentName: ['', Validators.required],
      departmentNameAr: ['', Validators.required],
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.deptAddForm.valid) {
      const name = this.deptAddForm.value.departmentName;
      const nameAr = this.deptAddForm.value.departmentNameAr;
      this.apiService.addDepartment(name, nameAr).subscribe(
        (response) => {
          //console.log('Department added successfully:', response);
          if (response.statusCode == '200') {
            this.router.navigate(['/admin/settings/departments']);
            this.openPopup();
          }
        },
        (error) => {
          console.error('Error adding department:', error);
        }
      );
    }
  }

  /*
  get departmentName() {
    return this.deptAddForm.get('departmentName');
  }

  get departmentNameAr() {
    return this.deptAddForm.get('departmentNameAr');
  } */

  cancel(): void {
    this.router.navigate(['/admin/settings/departments']);
  }

  // Success Popup
  openPopup(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '400px',
      data: {
        title: 'SUCCESS',
        message: 'DEPT_ADD_SUCCESS',
        button: 'CLOSE',
      },
    });
  }
}
