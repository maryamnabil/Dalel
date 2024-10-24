import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-fqa-form',
    templateUrl: './fqa-form.component.html',
    styleUrls: ['./fqa-form.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgIf, TranslateModule]
})
export class FqaFormComponent {
  @Input() FQAForm!: FormGroup;
  @Input() formSubmitted!: boolean;

  constructor(private fb: FormBuilder) {}
}
