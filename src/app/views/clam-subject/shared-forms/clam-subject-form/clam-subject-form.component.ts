import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-clam-subject-form',
  templateUrl: './clam-subject-form.component.html',
  styleUrls: ['./clam-subject-form.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, NgIf],
  standalone: true,
})
export class ClamSubjectFormComponent {
  @Input() ClamSubjectForm!: FormGroup;
  @Input() formSubmitted!: boolean;

  constructor(private fb: FormBuilder) {}
}
