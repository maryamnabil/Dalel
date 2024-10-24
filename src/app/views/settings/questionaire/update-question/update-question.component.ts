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
import { QuestionaireApiService } from 'src/app/shared/services/api/questionaire.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormActionsComponent } from 'src/app/shared/components/form-actions/form-actions.component';
import { BackwardComponent } from 'src/app/shared/components/backward/backward.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { QuestionFormComponent } from '../shared-form/question-form/question-form.component';
@Component({
  selector: 'app-update-question',
  templateUrl: './update-question.component.html',
  styleUrls: ['./update-question.component.scss'],
  standalone: true,
  imports: [
    BackwardComponent,
    FormsModule,
    ReactiveFormsModule,
    QuestionFormComponent,
    FormActionsComponent,
    TranslateModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class UpdateQuestionComponent {
  questionId = '';
  questionEditForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private questionService: QuestionaireApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.questionEditForm = this.fb.group({
      question: ['', Validators.required],
      questionAr: ['', Validators.required],
      answers: this.fb.array([this.createItem()]),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.questionId = params.get('id') || '';

      this.questionService.getQuestionById(this.questionId).subscribe(
        (response: any) => {
          const question = response.data;

          if (question) {
            this.questionEditForm.patchValue({
              question: question.question,
              questionAr: question.questionAr,
              answers: question.answers,
            });
          }
        },
        (error) => {
          console.error('Error fetching question details for edit:', error);
        }
      );
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required], // Example: an item with 'name' field
      nameAr: ['', Validators.required], // Optional description field
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.questionEditForm.valid) {
      const question = this.questionEditForm.value.question;
      const questionAr = this.questionEditForm.value.questionAr;
      const answers = this.questionEditForm.value.answers;
      this.questionService
        .updateQuestion(question, questionAr, answers, this.questionId)
        .subscribe(
          () => {
            this.router.navigate(['/admin/settings/questionaire']);
            this.openPopup();
          },
          (error) => {
            console.error('Error updating question:', error);
          }
        );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/settings/questionaire']);
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
