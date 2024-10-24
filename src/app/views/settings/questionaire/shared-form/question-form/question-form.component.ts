import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgIf } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    TranslateModule,
    CommonModule,
  ],
})
export class QuestionFormComponent {
  @Input() questionForm!: FormGroup;
  @Input() formSubmitted!: boolean;
  @Output() updateForm: EventEmitter<any> = new EventEmitter();

  data: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.questionForm.value.answers.length == 0) this.addAnswer();
  }

  ngOnChanges() {
    console.log(this.answers());
  }

  answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  newAnswer(name?: any, nameAr?: any): FormGroup {
    return this.fb.group({
      name: name ? name : '',
      nameAr: nameAr ? nameAr : '',
    });
  }
  addAnswer(name?: any, nameAr?: any) {
    console.log(this.answers());
    this.answers().push(this.newAnswer(name, nameAr));
    this.updateForm.emit(this.questionForm);
  }

  removeAnswer(i: number) {
    this.answers().removeAt(i);
    this.updateForm.emit(this.questionForm);
  }
}
