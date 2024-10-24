import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute , ParamMap, Router} from '@angular/router';

import { TranslationService } from 'src/app/shared/services/translation.service';

import { RoleApiService } from 'src/app/shared/services/api/roles.service';
import { PagesApiService } from 'src/app/shared/services/api/pages.service';

import { MatDialog } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';
import { NgFor } from '@angular/common';
import { RoleFormComponent } from '../../shared-forms/role-form/role-form.component';
import { BackwardComponent } from '../../../../shared/components/backward/backward.component';

@Component({
    selector: 'app-role-add',
    templateUrl: './role-add.component.html',
    styleUrls: ['./role-add.component.scss'],
    standalone: true,
    imports: [BackwardComponent, FormsModule, ReactiveFormsModule, RoleFormComponent, NgFor, FormActionsComponent, TranslateModule]
})
export class RoleAddComponent {
  departmentId = '';
  roleAddForm!: FormGroup;
  formSubmitted = false;

  allPages: any[] = [];
  selectedPermissions: any[] = [];

  constructor(
    private apiService: RoleApiService,
    private pagesApiService: PagesApiService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private translationService: TranslationService,
  ) {
    this.roleAddForm = this.fb.group({
      roleName: ['', Validators.required],
      selectedPages: this.fb.array(['', Validators.required]),
      checkAll: false,
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.departmentId = params.get('departmentId') || '';
    });

    this.translationService.currentLanguage$
      .subscribe(() => this.loadPages());

    this.loadPages();
  }

  loadPages() {
    const currentLanguage = this.translationService.getCurrentLanguage();
    this.pagesApiService.getPages().subscribe(
      (response: any) => {

        // this.allPages = response.data;
        const PAGES_DATA = response.data.map((page: any) => ({
          pageId: page.id,
          pageName: currentLanguage === 'en' ? page.name : page.nameAr,
        }));

       this.allPages = PAGES_DATA;

        /* this.allPages.forEach((page) => {
          this.roleAddForm.addControl(page, this.fb.control(false));
        }); */

        this.allPages.forEach(() => {
          this.selectedPages.push(this.fb.control(false));
        });

      },
      (error) => {
        console.error('Error loading pages', error);
      }
    );
  }

  get selectedPages(): FormArray {
    return this.roleAddForm.get('selectedPages') as FormArray;
  }

  onChecked(event: any, id:any){
    const isChecked = (<HTMLInputElement>event.target).checked;
    if(isChecked) {
      this.selectedPermissions.push(id);
    } else {
      const index = this.selectedPermissions.indexOf(id)
      if (index !== -1) this.selectedPermissions.splice(index, 1);
    }
  }

  onCheckAllChange(event: any) {
    const isChecked = event.target.checked;

    for (let i = 0; i < this.selectedPages.length; i++) {
      this.selectedPages.at(i).setValue(isChecked);
      const pageId = this.allPages[i].pageId;

      if (isChecked && !this.selectedPermissions.includes(pageId)) {
        this.selectedPermissions.push(pageId);
      } else if (!isChecked) {
        const index = this.selectedPermissions.indexOf(pageId);
        if (index !== -1) this.selectedPermissions.splice(index, 1);
      }
    }
  }

  // Submit the form and post a new role
  submitForm(): void {
    console.log(this.selectedPermissions);

    console.log('Form submitted');
    this.formSubmitted = true;
    if (this.roleAddForm.valid) {
      const name = this.roleAddForm.value.roleName;
      const permissions: any[] = this.selectedPermissions;

      this.apiService.addRole(name, +this.departmentId, permissions as [])
        .subscribe(
          (response) => {
            if (response.statusCode == "200"){
              this.router.navigate([`/admin/settings/roles/${this.departmentId}`]);
              this.openPopup();
              console.log('Added Successfully');
            }
          },
          (error) => {
            console.error('Error adding role:', error);
          }
        );
    }
  }

  cancel(): void {
    this.router.navigate([`/admin/settings/roles/${this.departmentId}`]);
  }

  // Success Popup
  openPopup(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '400px',
      data: {
        title: 'SUCCESS',
        message: 'ROLE_ADD_SUCCESS',
        button: 'CLOSE',
      },
    });
  }

  // Get back to roles list
  getBackwardLink(): string {
    return `/admin/settings/roles/${this.departmentId}`;
  }

}
