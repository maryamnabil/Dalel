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
import { CategoryApiService } from 'src/app/shared/services/api/category.service';
import { SkillsApiService } from 'src/app/shared/services/api/skills.service';
import { TranslateOptionsPipe } from '../../../shared/pipes/translate-options.pipe';
import { LocalizedNamePipe } from '../../../shared/pipes/localized-name.pipe';
import { FormActionsComponent } from '../../../shared/components/form-actions/form-actions.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { BackwardComponent } from '../../../shared/components/backward/backward.component';

@Component({
  selector: 'app-sub-business-industry-edit',
  templateUrl: './sub-business-industry-edit.component.html',
  styleUrls: ['./sub-business-industry-edit.component.scss'],
  standalone: true,
  imports: [
    BackwardComponent,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgIf,
    FormActionsComponent,
    AsyncPipe,
    TranslateModule,
    LocalizedNamePipe,
    TranslateOptionsPipe,
    MatDialogModule,
  ],
})
export class SubBusinessIndustryEditComponent {
  form!: FormGroup;
  formSubmitted = false;
  backUrl = '/admin/sub-business-industry';
  categories: any[] = [];
  skills: any[] = [];
  id: string;

  constructor(
    private apiService: CategoryApiService,
    private skillsService: SkillsApiService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public translate: TranslateService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: [null, Validators.required],
      nameAr: ['', Validators.required],
      parentCategoryId: [null, Validators.required],
      skillsIds: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;

    this.loadCategories();
    this.loadSkills();
    this.getDataById();
  }

  loadCategories() {
    this.apiService.getAllCategories().subscribe((res) => {
      this.categories = res?.data;
    });
  }

  loadSkills() {
    this.skillsService.getAllSkills().subscribe((res) => {
      this.skills = res?.data;
    });
  }

  getDataById() {
    this.apiService.getCategoryById(this.id).subscribe((res) => {
      this.form.patchValue(res?.data);
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.form.valid) {
      const { name, nameAr, parentCategoryId, skillsIds } = this.form.value;
      this.apiService
        .updateSubCategory(parentCategoryId, name, nameAr, skillsIds, this.id)
        .subscribe(
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
        message: 'CATEGORY_UPDATED_SUCCESSFULLY',
        button: 'CLOSE',
      },
    });
  }
}
