import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { FQAApiService } from 'src/app/shared/services/api/fqa.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormActionsComponent } from '../../../shared/components/form-actions/form-actions.component';
import { FqaFormComponent } from '../shared-forms/fqa-form/fqa-form.component';
import { BackwardComponent } from '../../../shared/components/backward/backward.component';

@Component({
  selector: 'app-fqa-edit',
  templateUrl: './fqa-edit.component.html',
  styleUrls: ['./fqa-edit.component.scss'],
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
export class FqaEditComponent implements OnInit {
  FQAId = '';
  FQAEditForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private apiService: FQAApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.FQAEditForm = this.fb.group({
      question: ['', Validators.required],
      questionAr: ['', Validators.required],
      answer: ['', Validators.required],
      answerAr: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.FQAId = params.get('id') || '';

      this.apiService.getFAQById(this.FQAId).subscribe(
        (response: any) => {
          const fqa = response.data;

          if (fqa) {
            this.FQAEditForm.patchValue({
              question: fqa.question,
              questionAr: fqa.questionAr,
              answer: fqa.answer,
              answerAr: fqa.answerAr,
            });
          }
        },
        (error) => {
          console.error('Error fetching FQA details for edit:', error);
        }
      );
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.FQAEditForm.valid) {
      const question = this.FQAEditForm.value.question;
      const questionAr = this.FQAEditForm.value.questionAr;
      const answer = this.FQAEditForm.value.answer;
      const answerAr = this.FQAEditForm.value.answerAr;

      this.apiService
        .updateFAQ(question, answer, questionAr, answerAr, this.FQAId)
        .subscribe(
          () => {
            this.router.navigate(['/admin/settings/faq/faqs']);
            this.openPopup();
          },
          (error) => {
            console.error('Error updating FQA:', error);
          }
        );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/settings/faq/faqs']);
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
