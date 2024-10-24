import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ManualApiService } from 'src/app/shared/services/api/manual.service';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { BackwardComponent } from '../../../shared/components/backward/backward.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaualFormComponent } from '../Shared-forms/maual-form/maual-form.component';
import { FormActionsComponent } from '../../../shared/components/form-actions/form-actions.component';

@Component({
  selector: 'app-manual-add',
  templateUrl: './manual-add.component.html',
  styleUrls: ['./manual-add.component.scss'],
  standalone: true,
  imports: [
    BackwardComponent,
    TranslateModule,
    MaualFormComponent,
    FormsModule,
    ReactiveFormsModule,
    FormActionsComponent,
  ],
})
export class ManualAddComponent {
  ManualAddForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private apiService: ManualApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.ManualAddForm = this.fb.group({
      TitleEN: ['', Validators.required],
      TitleAr: ['', Validators.required],
      URL: [''],
      description: ['', Validators.required],
      descriptionAr: ['', Validators.required],
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.ManualAddForm.valid) {
      const name = this.ManualAddForm.value.TitleEN;
      const nameAr = this.ManualAddForm.value.TitleAr;
      const URL = this.ManualAddForm.value.URL;
      const DescEn = this.ManualAddForm.value.description;
      const DescAr = this.ManualAddForm.value.descriptionAr;

      this.apiService.addManual(URL, name, nameAr, DescEn, DescAr).subscribe(
        (response) => {
          if (response.statusCode == '200') {
            this.router.navigate(['/admin/manual/manuals']); // Fixed the navigation path here
            this.openPopup();
          }
        },
        (error) => {
          console.error('Error adding manual:', error);
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/manual/manuals']);
  }

  openPopup(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '400px',
      data: {
        title: 'SUCCESS',
        message: 'MANUAL_ADD_SUCCESS',
        button: 'CLOSE',
      },
    });
  }
}
