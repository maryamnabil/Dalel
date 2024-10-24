import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { ClamSubjectApiService } from 'src/app/shared/services/api/clam-subject.service';
import { BackwardComponent } from '../../../shared/components/backward/backward.component';
import { ClamSubjectFormComponent } from '../shared-forms/clam-subject-form/clam-subject-form.component';
import { FormActionsComponent } from '../../../shared/components/form-actions/form-actions.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-clam-subject-edit',
  templateUrl: './clam-subject-edit.component.html',
  styleUrls: ['./clam-subject-edit.component.scss'],
  standalone: true,
  imports: [
    BackwardComponent,
    ClamSubjectFormComponent,
    FormActionsComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class ClamSubjectEditComponent implements OnInit {
  clamSubjectId = '';
  clamEditForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private apiService: ClamSubjectApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.clamEditForm = this.fb.group({
      ClamSubjectName: ['', Validators.required],
      ClamSubjectNameAr: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.clamSubjectId = params.get('id') || '';

      this.apiService.getClamSubjectById(this.clamSubjectId).subscribe(
        (response: any) => {
          const clamSubject = response.data;

          if (clamSubject) {
            this.clamEditForm.patchValue({
              ClamSubjectName: clamSubject.name,
              ClamSubjectNameAr: clamSubject.nameAr,
            });
          }
        },
        (error) => {
          console.error(
            'Error fetching claim Subject details for edit:',
            error
          );
        }
      );
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.clamEditForm.valid) {
      const name = this.clamEditForm.value.ClamSubjectName;
      const nameAr = this.clamEditForm.value.ClamSubjectNameAr;
      this.apiService
        .updateClamSubject(name, nameAr, this.clamSubjectId)
        .subscribe(
          () => {
            this.router.navigate(['/admin/claim-subject/claim-list']);
            this.openPopup();
          },
          (error) => {
            console.error('Error updating claim Subject:', error);
          }
        );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/claim-subject/claim-list']);
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
