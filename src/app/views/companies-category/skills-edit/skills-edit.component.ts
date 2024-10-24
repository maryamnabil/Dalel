import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SkillsApiService } from 'src/app/shared/services/api/skills.service';
import { FormActionsComponent } from '../../../shared/components/form-actions/form-actions.component';
import { NgIf } from '@angular/common';
import { BackwardComponent } from '../../../shared/components/backward/backward.component';

@Component({
  selector: 'app-skills-edit',
  templateUrl: './skills-edit.component.html',
  styleUrls: ['./skills-edit.component.scss'],
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
export class SkillsEditComponent implements OnInit {
  form!: FormGroup;
  formSubmitted = false;
  backUrl = '/admin/skills';
  id: string;

  constructor(
    private apiService: SkillsApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public translate: TranslateService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nameAr: [null, Validators.required],
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.loadData();
  }

  loadData() {
    this.apiService.getSkillById(this.id).subscribe((res) => {
      this.form.patchValue(res?.data);
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.form.valid) {
      const { name, nameAr } = this.form.value;
      this.apiService.updateSkill(+this.id, name, nameAr).subscribe(
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
        message: 'SKILL_UPDATED_SUCCESSFULLY',
        button: 'CLOSE',
      },
    });
  }
}
