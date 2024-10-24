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
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SkillsApiService } from 'src/app/shared/services/api/skills.service';
import { FormActionsComponent } from '../../../shared/components/form-actions/form-actions.component';
import { NgIf } from '@angular/common';
import { BackwardComponent } from '../../../shared/components/backward/backward.component';

@Component({
  selector: 'app-skills-add',
  templateUrl: './skills-add.component.html',
  styleUrls: ['./skills-add.component.scss'],
  standalone: true,
  imports: [
    BackwardComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    FormActionsComponent,
    TranslateModule,
    MatDialogModule,
  ],
})
export class SkillsAddComponent {
  form!: FormGroup;
  formSubmitted = false;
  backUrl = '/admin/skills';

  constructor(
    private apiService: SkillsApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public translate: TranslateService
  ) {
    this.form = this.fb.group({
      nameAr: [null, Validators.required],
      name: ['', Validators.required],
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.form.valid) {
      const { name, nameAr } = this.form.value;
      this.apiService.addSkill(name, nameAr).subscribe(
        (response) => {
          if (response.statusCode == '200') {
            this.router.navigate([this.backUrl]);
            this.openPopup();
          }
        },
        (error) => {
          console.error('Error adding department:', error);
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate([this.backUrl]);
  }

  // Success Popup
  openPopup(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '400px',
      data: {
        title: 'SUCCESS',
        message: 'SKILL_ADDED_SUCCESSFULLY',
        button: 'CLOSE',
      },
    });
  }
}
