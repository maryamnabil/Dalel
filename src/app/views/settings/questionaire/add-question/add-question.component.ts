import { Component } from '@angular/core';
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
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss'],
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
export class AddQuestionComponent {
  questionForm!: FormGroup;
  formSubmitted = false;
  questionId = '';
  constructor(
    private questionApiService: QuestionaireApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.questionForm = this.fb.group({
      question: '',
      questionAr: '',
      answers: this.fb.array([]),
    });
  }
  updateForm(form: any) {
    this.questionForm = form;
  }
  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.questionId = params.get('questionId') || '';
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.questionForm.valid) {
      this.questionApiService
        .addQuestion(
          this.questionForm.value.question,
          this.questionForm.value.questionAr,
          this.questionForm.value.answers
        )
        .subscribe(
          (response) => {
            if (response.statusCode === 200) {
              this.router.navigate(['/admin/settings/questionaire']);
              this.openPopup();
            }
          },
          (error) => {
            console.error('Error adding question:', error);
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
        message: 'ADD_QUESTION_SUCCESS',
        button: 'CLOSE',
      },
    });
  }
}
