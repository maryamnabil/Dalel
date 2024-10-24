import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { ManualApiService } from 'src/app/shared/services/api/manual.service';
import { BackwardComponent } from '../../../shared/components/backward/backward.component';
import { MaualFormComponent } from '../Shared-forms/maual-form/maual-form.component';
import { FormActionsComponent } from '../../../shared/components/form-actions/form-actions.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-manual-edit',
  templateUrl: './manual-edit.component.html',
  styleUrls: ['./manual-edit.component.scss'],
  standalone: true,
  imports: [
    BackwardComponent,
    MaualFormComponent,
    FormActionsComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class ManualEditComponent {
  ManualId = '';
  ManualEditForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private apiService: ManualApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.ManualEditForm = this.fb.group({
      TitleEN: ['', Validators.required],
      TitleAr: ['', Validators.required],
      URL: [''],
      description: ['', Validators.required],
      descriptionAr: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.ManualId = params.get('id') || '';

      this.apiService.getmanualById(this.ManualId).subscribe(
        (response: any) => {
          const manual = response.data;

          if (manual) {
            console.log(manual);
            this.ManualEditForm.patchValue({
              TitleEN: manual.name,
              TitleAr: manual.nameAr,
              URL: manual.url,
              description: manual.description,
              descriptionAr: manual.descriptionAr,
            });
          }
        },
        (error) => {
          console.error('Error fetching Manual details for edit:', error);
        }
      );
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.ManualEditForm.valid) {
      const name = this.ManualEditForm.value.TitleEN;
      const nameAr = this.ManualEditForm.value.TitleAr;
      const URL = this.ManualEditForm.value.URL;
      const DescEn = this.ManualEditForm.value.description;
      const DescAr = this.ManualEditForm.value.descriptionAr;
      this.apiService
        .updatemanual(this.ManualId, URL, name, nameAr, DescEn, DescAr)
        .subscribe(
          () => {
            this.router.navigate(['/admin/manual/manuals']);
            this.openPopup();
          },
          (error) => {
            console.error('Error updating Manual:', error);
          }
        );
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/manual/manuals']);
  }

  // Success Popup
  openPopup(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '400px',
      data: {
        title: 'SUCCESS',
        message: 'EDIT_SUCCESS',
        button: 'CLOSE',
      },
    });
  }
}
