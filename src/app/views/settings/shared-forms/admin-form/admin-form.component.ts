import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-admin-form',
    templateUrl: './admin-form.component.html',
    styleUrls: ['./admin-form.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgIf, TranslateModule]
})
export class AdminFormComponent {

  @Input() adminForm!: FormGroup;
  @Input() formSubmitted!: boolean;

  // Show and hide password
  public passwordValue = '';
  public showPassword = false;

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

}

