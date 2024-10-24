import { Component, DestroyRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { BackwardComponent } from 'src/app/shared/components/backward/backward.component';
import { FileUploaderComponent } from 'src/app/shared/components/file-uploader/file-uploader.component';
import { FormActionsComponent } from 'src/app/shared/components/form-actions/form-actions.component';
import { NewsApiService } from 'src/app/shared/services/api/news.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateOptionsPipe } from 'src/app/shared/pipes/translate-options.pipe';
import { LocalizedNamePipe } from 'src/app/shared/pipes/localized-name.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NewsCategoryApiService } from 'src/app/shared/services/api/news-category.service';

@Component({
  selector: 'app-news-add',
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
    NgSelectModule,
    TranslateOptionsPipe,
    AsyncPipe,
    LocalizedNamePipe,
  ],
  templateUrl: './news-add.component.html',
  styleUrls: ['./news-add.component.scss'],
})
export class NewsAddComponent {
  form!: FormGroup;
  formSubmitted = false;
  backUrl = '/admin/settings/news/news-list';
  attachment!: File;
  imageSrc: any;
  categories: any[] = [];

  constructor(
    private apiService: NewsApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public translate: TranslateService,
    private destroyRef: DestroyRef,
    private newsCategoryService: NewsCategoryApiService
  ) {
    this.form = this.fb.group({
      newsCategoryId: [null, Validators.required],
      titleAr: [null, Validators.required],
      titleEn: ['', Validators.required],
      descriptionAr: ['', Validators.required],
      descriptionEn: ['', Validators.required],
      attachments: this.fb.array([]),
    });
    this.addAttachmentControl();
    this.loadCategories();
  }

  loadCategories() {
    this.newsCategoryService
      .getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.categories = res?.data;
      });
  }

  get attachmentsFormArray(): FormArray {
    return this.form.get('attachments') as FormArray;
  }

  // Function to add a new attachment control
  addAttachmentControl(): void {
    const newAttachmentControl = this.fb.control(null, Validators.required);
    this.attachmentsFormArray.push(newAttachmentControl);
  }

  // Function to remove an attachment control
  removeAttachmentControl(index: number): void {
    this.attachmentsFormArray.removeAt(index);
  }
  submitForm(): void {
    this.formSubmitted = true;
    if (this.form.valid) {
      const {
        newsCategoryId,
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        attachments,
      } = this.form.value;

      this.apiService
        .addNews(
          newsCategoryId,
          titleEn,
          titleAr,
          descriptionEn,
          descriptionAr,
          attachments
        )
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
