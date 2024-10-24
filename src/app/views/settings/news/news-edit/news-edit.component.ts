import { Component, DestroyRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { BackwardComponent } from 'src/app/shared/components/backward/backward.component';
import { FileUploaderComponent } from 'src/app/shared/components/file-uploader/file-uploader.component';
import { FormActionsComponent } from 'src/app/shared/components/form-actions/form-actions.component';
import { NewsApiService } from 'src/app/shared/services/api/news.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getFileName, isValidResponse } from 'src/app/core/helper/helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Observable, forkJoin, of } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateOptionsPipe } from 'src/app/shared/pipes/translate-options.pipe';
import { LocalizedNamePipe } from 'src/app/shared/pipes/localized-name.pipe';
import { NewsCategoryApiService } from 'src/app/shared/services/api/news-category.service';

@Component({
  selector: 'app-news-edit',
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
  templateUrl: './news-edit.component.html',
  styleUrls: ['./news-edit.component.scss'],
})
export class NewsEditComponent implements OnInit {
  form!: FormGroup;
  formSubmitted = false;
  backUrl = '/admin/settings/news/news-list';
  attachment!: File;
  imageSrc: any;
  id: string;
  attachmentUrls: string[] = [];
  attachments: any[] = [];
  categories: any[] = [];

  constructor(
    private apiService: NewsApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private helperService: HelperService,
    private newsCategoryService: NewsCategoryApiService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.initForm();
    this.loadCategories();
    this.loadDetails();
  }

  loadCategories() {
    this.newsCategoryService
      .getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.categories = res?.data;
      });
  }

  loadDetails() {
    this.apiService
      .getNewsById(this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (isValidResponse(res)) {
          this.setFormValue(res?.data);
        }
      });
  }

  setFormValue(data: any) {
    this.form.patchValue(data);
    this.form.controls['newsCategoryId'].setValue(data?.newsCategory?.id);
    const baseUrl = data?.baseUrl;
    this.attachments = data?.newsAttachments;
    this.attachmentUrls = data?.newsAttachments.map((attachment: any) => {
      return attachment?.attachmentsPath;
    });
    this.attachmentUrls?.forEach((attachment: any) => {
      this.addAttachmentControl(baseUrl + attachment);
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      newsCategoryId: [null, Validators.required],
      titleAr: [null, Validators.required],
      titleEn: ['', Validators.required],
      descriptionAr: ['', Validators.required],
      descriptionEn: ['', Validators.required],
      attachments: this.fb.array([]),
    });
  }

  get attachmentsFormArray(): FormArray {
    return this.form.get('attachments') as FormArray;
  }

  // Function to add a new attachment control
  addAttachmentControl(filePath?: string): void {
    const newAttachmentControl = this.fb.control(filePath, Validators.required);
    this.attachmentsFormArray.push(newAttachmentControl);
  }

  // Function to remove an attachment control
  removeAttachmentControl(index: number): void {
    this.attachmentsFormArray.removeAt(index);
  }
  onRemoveFile(file: File | string) {
    if (this.isServerFile(file)) {
      const attachmentId = this.attachments.find(
        (item) => item.attachmentsPath === getFileName(file as string)
      )?.id;
      this.deleteAttachment(attachmentId);
    }
  }

  private isServerFile(file: string | File) {
    return (
      typeof file === 'string' &&
      this.attachmentUrls.includes(
        this.helperService.extractFilenameFromUrl(file)
      )
    );
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
      if (attachments.every((item: any) => this.isServerFile(item))) {
        this.editNews(
          newsCategoryId,
          titleEn,
          titleAr,
          descriptionEn,
          descriptionAr,
          []
        );
      } else {
        forkJoin(
          this.getAttachmentObservable(
            attachments.filter((item: any) => !this.isServerFile(item))
          )
        )
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((convertedFiles: File[]) => {
            this.editNews(
              newsCategoryId,
              titleEn,
              titleAr,
              descriptionEn,
              descriptionAr,
              convertedFiles
            );
          });
      }
    }
  }

  editNews(
    newsCategoryId: string,
    titleEn: string,
    titleAr: string,
    descriptionEn: string,
    descriptionAr: string,
    attachments: File[]
  ) {
    this.apiService
      .editNews(
        this.id,
        newsCategoryId,
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        attachments?.length ? attachments : []
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
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

  deleteAttachment(id: number) {
    this.apiService
      .deleteAttachment(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  getAttachmentObservable(attachments: any) {
    const fileObservables: Observable<File>[] = [];

    // Iterate over the attachments array
    attachments.forEach((attachment: any) => {
      // Check if attachment is a string (URL)
      if (typeof attachment === 'string') {
        // Convert URL to file and push the observable to fileObservables array
        if (!this.isServerFile(attachment)) {
          fileObservables.push(this.helperService.convertUrlToFile(attachment));
        }
      } else {
        // If attachment is already a file, push it directly to the array
        fileObservables.push(of(attachment));
      }
    });
    return fileObservables;
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
