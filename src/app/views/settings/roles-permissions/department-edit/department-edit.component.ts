import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { DeptApiService } from 'src/app/shared/services/api/departments.service';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';
import { DepartmentFormComponent } from '../../shared-forms/department-form/department-form.component';
import { BackwardComponent } from '../../../../shared/components/backward/backward.component';

@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrls: ['./department-edit.component.scss'],
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
export class DepartmentEditComponent implements OnInit {
  departmentId = '';
  deptEditForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private apiService: DeptApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.deptEditForm = this.fb.group({
      departmentName: ['', Validators.required],
      departmentNameAr: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.departmentId = params.get('id') || '';

      this.apiService.getDepartmentById(this.departmentId).subscribe(
        (response: any) => {
          const department = response.data;

          if (department) {
            this.deptEditForm.patchValue({
              departmentName: department.name,
              departmentNameAr: department.nameAr,
            });
          }
        },
        (error) => {
          console.error('Error fetching department details for edit:', error);
        }
      );
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.deptEditForm.valid) {
      const name = this.deptEditForm.value.departmentName;
      const nameAr = this.deptEditForm.value.departmentNameAr;
      this.apiService
        .updateDepartment(name, nameAr, this.departmentId)
        .subscribe(
          () => {
            this.router.navigate(['/admin/settings/departments']);
            this.openPopup();
          },
          (error) => {
            console.error('Error updating department:', error);
          }
        );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/settings/departments']);
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
