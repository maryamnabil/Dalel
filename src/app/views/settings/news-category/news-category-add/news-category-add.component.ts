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
import { NgFor, NgIf } from '@angular/common';
import { BackwardComponent } from 'src/app/shared/components/backward/backward.component';
import { FileUploaderComponent } from 'src/app/shared/components/file-uploader/file-uploader.component';
import { FormActionsComponent } from 'src/app/shared/components/form-actions/form-actions.component';
import { NewsCategoryApiService } from 'src/app/shared/services/api/news-category.service';

@Component({
  selector: 'app-news-category-add',
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
    NgFor,
  ],
  templateUrl: './news-category-add.component.html',
  styleUrls: ['./news-category-add.component.scss'],
})
export class NewsCategoryAddComponent {
  form!: FormGroup;
  formSubmitted = false;
  backUrl = '/admin/settings/news-category/news-category-list';
  attachment!: File;
  imageSrc: any;

  constructor(
    private apiService: NewsCategoryApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public translate: TranslateService
  ) {
    this.form = this.fb.group({
      titleAr: [null, Validators.required],
      titleEn: ['', Validators.required],
      descriptionAr: ['', Validators.required],
      descriptionEn: ['', Validators.required],
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.form.valid) {
      const { titleEn, titleAr, descriptionEn, descriptionAr } =
        this.form.value;

      this.apiService
        .addNewsCategory(titleEn, titleAr, descriptionEn, descriptionAr)
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
