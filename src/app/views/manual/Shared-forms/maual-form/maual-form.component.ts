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
  selector: 'app-maual-form',
  templateUrl: './maual-form.component.html',
  styleUrls: ['./maual-form.component.scss'],
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, NgIf],
  standalone: true,
})
export class MaualFormComponent {
  @Input() manualForm!: FormGroup;
  @Input() formSubmitted!: boolean;

  constructor(private fb: FormBuilder) {}
}
