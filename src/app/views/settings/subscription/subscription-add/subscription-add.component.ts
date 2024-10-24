import { Component, DestroyRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { BackwardComponent } from 'src/app/shared/components/backward/backward.component';
import { FileUploaderComponent } from 'src/app/shared/components/file-uploader/file-uploader.component';
import { FormActionsComponent } from 'src/app/shared/components/form-actions/form-actions.component';
import { SubscriptionApiService } from 'src/app/shared/services/api/subscription.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateOptionsPipe } from 'src/app/shared/pipes/translate-options.pipe';
import { LocalizedNamePipe } from 'src/app/shared/pipes/localized-name.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-news-add',
  standalone: true,
  imports: [
    BackwardComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    FileUploaderComponent,
    FormActionsComponent,
    TranslateModule,
    MatDialogModule,
    NgFor,
    NgSelectModule,
    TranslateOptionsPipe,
    AsyncPipe,
    LocalizedNamePipe,
  ],
  templateUrl: './subscription-add.component.html',
  styleUrls: ['./subscription-add.component.scss'],
})
export class SubscriptionAddComponent {
  subscriptionForm!: FormGroup;
  formSubmitted = false;
  backUrl = '/admin/settings/subscription';


  constructor(
    private apiService: SubscriptionApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public translate: TranslateService,
    private destroyRef: DestroyRef,
  ) {
    this.subscriptionForm = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      price: ['', Validators.required],
      numberOfValidDays: ['', Validators.required],
    });
  
  }

  // loadCategories() {
  //   this.newsCategoryService
  //     .getAllCategories()
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe((res) => {
  //       this.categories = res?.data;
  //     });
  // }





  submitForm(): void {
    this.formSubmitted = true;
    if (this.subscriptionForm.valid) {
      const {
        name, nameAr, price, numberOfValidDays
      } = this.subscriptionForm.value;

      this.apiService
        .addSubscription(
          name, nameAr, price, numberOfValidDays
        )
        .subscribe(
          (response) => {
            if (response.statusCode === 200) {

              this.router.navigate([this.backUrl]);
              this.openPopup();
            }
          },
          (error) => {
            console.error('Error adding subscription:', error);
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
        message: 'CATEGORY_ADDED_SUCCESSFULLY',
        button: 'CLOSE',
      },
    });
  }
}
