import { Component, DestroyRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NgFor, NgIf } from '@angular/common';
import { BackwardComponent } from 'src/app/shared/components/backward/backward.component';
import { FileUploaderComponent } from 'src/app/shared/components/file-uploader/file-uploader.component';
import { FormActionsComponent } from 'src/app/shared/components/form-actions/form-actions.component';
import { NewsCategoryApiService } from 'src/app/shared/services/api/news-category.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isValidResponse } from 'src/app/core/helper/helper';

@Component({
  selector: 'app-news-category-edit',
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
  templateUrl: './news-category-edit.component.html',
  styleUrls: ['./news-category-edit.component.scss'],
})
export class NewsCategoryEditComponent implements OnInit {
  form!: FormGroup;
  formSubmitted = false;
  backUrl = '/admin/settings/news-category/news-category-list';
  id: string;

  constructor(
    private apiService: NewsCategoryApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.form = this.fb.group({
      nameAr: [null, Validators.required],
      name: ['', Validators.required],
      descriptionAr: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.loadDetails();
  }

  loadDetails() {
    this.apiService
      .getNewsCategoryById(this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (isValidResponse(res)) {
          this.form.patchValue(res?.data);
        }
      });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.form.valid) {
      const { name, nameAr, description, descriptionAr } = this.form.value;

      this.apiService
        .editNewsCategory(this.id, name, nameAr, description, descriptionAr)
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
        message: 'CATEGORY_UPDATED_SUCCESSFULLY',
        button: 'CLOSE',
      },
    });
  }
}
