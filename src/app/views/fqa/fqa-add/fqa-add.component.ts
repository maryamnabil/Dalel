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
import { FQAApiService } from 'src/app/shared/services/api/fqa.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormActionsComponent } from '../../../shared/components/form-actions/form-actions.component';
import { FqaFormComponent } from '../shared-forms/fqa-form/fqa-form.component';
import { BackwardComponent } from '../../../shared/components/backward/backward.component';
FQAApiService;
@Component({
  selector: 'app-fqa-add',
  templateUrl: './fqa-add.component.html',
  styleUrls: ['./fqa-add.component.scss'],
  standalone: true,
  imports: [
    BackwardComponent,
    FormsModule,
    ReactiveFormsModule,
    FqaFormComponent,
    FormActionsComponent,
    TranslateModule,
    MatDialogModule,
  ],
})
export class FqaAddComponent {
  FQAForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private apiService: FQAApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.FQAForm = this.fb.group({
      question: ['', Validators.required],
      questionAr: ['', Validators.required],
      answer: ['', Validators.required],
      answerAr: ['', Validators.required],
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.FQAForm.valid) {
      const question = this.FQAForm.value.question;
      const questionAr = this.FQAForm.value.questionAr;
      const answer = this.FQAForm.value.answer;
      const answerAr = this.FQAForm.value.answerAr;

      this.apiService.addFAQ(question, answer, questionAr, answerAr).subscribe(
        (response) => {
          if (response.statusCode == '200') {
            this.router.navigate(['/admin/settings/faq/faqs']);
            this.openPopup();
          }
        },
        (error) => {
          console.error('Error adding FQA:', error);
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/settings/faq/faqs']);
  }

  openPopup(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '400px',
      data: {
        title: 'SUCCESS',
        message: 'FQA_ADD_SUCCESS',
        button: 'CLOSE',
      },
    });
  }
}
