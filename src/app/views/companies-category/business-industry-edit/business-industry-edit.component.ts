import { Component, OnInit } from '@angular/core';
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
import { CategoryApiService } from 'src/app/shared/services/api/category.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { FormActionsComponent } from '../../../shared/components/form-actions/form-actions.component';
import { FileUploaderComponent } from '../../../shared/components/file-uploader/file-uploader.component';
import { NgIf } from '@angular/common';
import { BackwardComponent } from '../../../shared/components/backward/backward.component';

@Component({
  selector: 'app-business-industry-edit',
  templateUrl: './business-industry-edit.component.html',
  styleUrls: ['./business-industry-edit.component.scss'],
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
export class BusinessIndustryEditComponent implements OnInit {
  form!: FormGroup;
  formSubmitted = false;
  backUrl = '/admin/business-industry';
  attachment!: File;
  imageSrc: any;
  id: string;

  constructor(
    private apiService: CategoryApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private helperService: HelperService
  ) {
    this.form = this.fb.group({
      nameAr: [null, Validators.required],
      name: ['', Validators.required],
      photoPath: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.getDataById();
  }

  getDataById() {
    this.apiService.getCategoryById(this.id).subscribe((res) => {
      this.form.patchValue(res?.data);
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
      let { name, nameAr, photoPath } = this.form.value;

      if (typeof photoPath === 'string') {
        this.helperService.convertUrlToFile(photoPath).subscribe(
          (file: File) => {
            this.updateCategory(name, nameAr, file);
          },
          (error: any) => {
            console.error('Error converting URL to file:', error);
          }
        );
      } else {
        this.updateCategory(name, nameAr, photoPath);
      }
    }
  }

  updateCategory(name: string, nameAr: string, photo: any): void {
    this.apiService.updateCategory(name, nameAr, photo, this.id).subscribe(
      (response) => {
        if (response.statusCode == '200') {
          this.router.navigate([this.backUrl]);
          this.openPopup();
        }
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
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
