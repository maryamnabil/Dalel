import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-department-form',
    templateUrl: './department-form.component.html',
    styleUrls: ['./department-form.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgIf, TranslateModule]
})
export class DepartmentFormComponent {

  @Input() departmentForm!: FormGroup;
  @Input() formSubmitted!: boolean;

  constructor(private fb: FormBuilder) {}
}
