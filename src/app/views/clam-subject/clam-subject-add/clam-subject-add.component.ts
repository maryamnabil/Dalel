import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { ClamSubjectApiService } from 'src/app/shared/services/api/clam-subject.service';
import { BackwardComponent } from '../../../shared/components/backward/backward.component';
import { ClamSubjectFormComponent } from '../shared-forms/clam-subject-form/clam-subject-form.component';
import { FormActionsComponent } from '../../../shared/components/form-actions/form-actions.component';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-clam-subject-add',
  templateUrl: './clam-subject-add.component.html',
  styleUrls: ['./clam-subject-add.component.scss'],
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
export class ClamSubjectAddComponent {
  ClamAddForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private apiService: ClamSubjectApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.ClamAddForm = this.fb.group({
      ClamSubjectName: ['', Validators.required],
      ClamSubjectNameAr: ['', Validators.required],
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.ClamAddForm.valid) {
      const name = this.ClamAddForm.value.ClamSubjectName;
      const nameAr = this.ClamAddForm.value.ClamSubjectNameAr;
      this.apiService.addClamSubject(name, nameAr).subscribe(
        (response) => {
          //console.log('ClamSubject added successfully:', response);
          if (response.statusCode == '200') {
            this.router.navigate(['/admin/claim-subject/claim-list']);
            this.openPopup();
          }
        },
        (error) => {
          console.error('Error adding ClamSubject:', error);
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
        message: 'Clam_ADD_SUCCESS',
        button: 'CLOSE',
      },
    });
  }
}
