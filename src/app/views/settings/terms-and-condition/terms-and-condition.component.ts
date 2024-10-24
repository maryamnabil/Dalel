import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { StaticPageService } from 'src/app/shared/services/api/static-page.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgIf } from '@angular/common';
import { EditorComponent } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.component.html',
  styleUrls: ['./terms-and-condition.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    EditorComponent,
    NgIf,
    NgxDropzoneModule,
    MatIconModule,
    TranslateModule,
    MatDialogModule,
  ],
})
export class TermsAndConditionComponent implements OnInit {
  form: FormGroup;
  formSubmitted = false;
  pageName = 'terms';
  pageExists = false;
  id = '';
  attachId!: string;
  attachPath!: string;

  FilePath = 'http://38.242.140.146:9822';
  imagePath: any;
  formData!: FormData;
  imageUrl: any;
  attachment!: File;
  imageSrc: any;

  constructor(
    private staticPageService: StaticPageService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private translationService: TranslationService
  ) {
    this.formData = new FormData();

    this.form = this.fb.group({
      content: ['', Validators.required],
      contentAr: ['', Validators.required],
      attachment: [null], // Add attachment form control
    });
  }

  ngOnInit(): void {
    this.staticPageService.loadPage(this.pageName).subscribe(
      (response) => {
        if (response.statusCode === 200) {
          this.pageExists = true;
          const page = response.data;
          console.log(page);
          this.form.patchValue({
            content: page.content,
            contentAr: page.contentAr,
          });
          this.id = page.id;
          this.attachId = page.attachmentsPath[0]?.id;
          this.attachPath = page.attachmentsPath[0]?.attachmentsPath;
          if (this.attachPath) {
            this.imageSrc = this.FilePath + this.attachPath;
          }
        }
      },
      (error) => {
        console.error('Error fetching Privacy Policy:', error);
      }
    );
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.form.valid) {
      const content = this.form.value.content;
      const contentAr = this.form.value.contentAr;

      if (this.pageExists) {
        this.staticPageService
          .updatePage(
            this.id,
            this.pageName,
            content,
            contentAr,
            this.attachment
          )
          .subscribe(
            (response) => {
              if (response.statusCode === 200) {
                this.openPopup();
              } else {
                const errorMessage = response.message;
                const errorMessageAr = response.messageAr;
                this.openPopupError(errorMessage, errorMessageAr);
              }
            },
            (error) => {
              console.error('Error updating Privacy Policy:', error);
            }
          );
      } else {
        // Privacy policy does not exist, add it
        this.staticPageService
          .addPage(this.pageName, content, contentAr, this.attachment)
          .subscribe(
            (response) => {
              if (response.statusCode === 200) {
                this.openPopup();
                this.pageExists = true;
              } else {
                const errorMessage = response.message;
                const errorMessageAr = response.messageAr;
                this.openPopupError(errorMessage, errorMessageAr);
              }
            },
            (error) => {
              console.error('Error adding Privacy Policy:', error);
            }
          );
      }
    }
  }

  openPopupError(errorMessage: string, errorMessageAr: string): void {
    const messageToShow =
      this.translationService.getCurrentLanguage() === 'en'
        ? errorMessage
        : errorMessageAr;
    this.dialog.open(PopupComponent, {
      width: '300px',
      data: {
        message: messageToShow,
        button: 'RETRY',
      },
    });
  }
  openPopup(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '400px',
      data: {
        title: 'SUCCESS',
        message: this.pageExists
          ? 'TERMS_CONDITIONS_UPDATE_SUCCESS'
          : 'TERMS_CONDITIONS_ADD_SUCCESS',
        button: 'CLOSE',
      },
    });
  }

  config: DropzoneConfigInterface = {
    url: '',
    maxFiles: 1, // Maximum number of files allowed to upload
    acceptedFiles: 'image/*', // Accepted file types (in this case, only images)
    autoProcessQueue: false, // Don't automatically process the uploaded file(s)
  };

  editorConfig = {
    height: 200,
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount',
    ],
    toolbar:
      'undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent |forecolor | removeformat | help',
  };
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
    if (this.attachId) {
      this.staticPageService.deleteAttachment(this.attachId);
    }
  }
}
