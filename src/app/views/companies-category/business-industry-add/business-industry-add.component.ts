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
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CategoryApiService } from 'src/app/shared/services/api/category.service';
import { FormActionsComponent } from '../../../shared/components/form-actions/form-actions.component';
import { FileUploaderComponent } from '../../../shared/components/file-uploader/file-uploader.component';
import { NgIf } from '@angular/common';
import { BackwardComponent } from '../../../shared/components/backward/backward.component';

@Component({
  selector: 'app-business-industry-add',
  templateUrl: './business-industry-add.component.html',
  styleUrls: ['./business-industry-add.component.scss'],
  standalone: true,
  imports: [
    BackwardComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    FileUploaderComponent,
    FormActionsComponent,
    TranslateModule,
    MatDialogModule,
  ],
})
export class BusinessIndustryAddComponent {
  form!: FormGroup;
  formSubmitted = false;
  backUrl = '/admin/business-industry';
  attachment!: File;
  imageSrc: any;

  constructor(
    private apiService: CategoryApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public translate: TranslateService
  ) {
    this.form = this.fb.group({
      categoryAr: [null, Validators.required],
      categoryEn: ['', Validators.required],
      categoryPhoto: ['', Validators.required],
    });
  }

  onFileSelect(event: any) {
    if (event.addedFiles && event.addedFiles.length > 0) {
      const files: File[] = event.addedFiles;
      const firstFile: File = files[0];
      if (firstFile) {
        this.attachment = firstFile;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(firstFile); // Read
      } else {
        console.error('No files added.');
      }
    } else {
      console.error('No files added.');
    }
  }

  removeFile(event: any) {
    event.stopPropagation();
    this.imageSrc = null;
    this.attachment = null as any;
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.form.valid) {
      const { categoryAr, categoryEn, categoryPhoto } = this.form.value;
      this.apiService
        .addCategory(categoryEn, categoryAr, categoryPhoto)
        .subscribe(
          (response) => {
            if (response.statusCode == '200') {
              this.router.navigate([this.backUrl]);
              this.openPopup();
            }
          },
          (error) => {
            console.error('Error adding department:', error);
          }
        );
    }
  }

  cancel(): void {
    this.router.navigate([this.backUrl]);
  }

  // Success Popup
  openPopup(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '400px',
      data: {
        title: 'SUCCESS',
        message: 'CATEGORY_ADDED_SUCCESSFULLY',
        button: 'CLOSE',
      },
    });
  }
}
