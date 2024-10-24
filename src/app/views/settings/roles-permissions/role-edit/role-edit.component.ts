import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RoleApiService } from 'src/app/shared/services/api/roles.service';

import { MatDialog } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { TranslationService } from 'src/app/shared/services/translation.service';

import { PagesApiService } from 'src/app/shared/services/api/pages.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';
import { NgFor } from '@angular/common';
import { RoleFormComponent } from '../../shared-forms/role-form/role-form.component';
import { BackwardComponent } from '../../../../shared/components/backward/backward.component';


@Component({
    selector: 'app-role-edit',
    templateUrl: './role-edit.component.html',
    styleUrls: ['./role-edit.component.scss'],
    standalone: true,
    imports: [BackwardComponent, FormsModule, ReactiveFormsModule, RoleFormComponent, NgFor, FormActionsComponent, TranslateModule]
})
export class RoleEditComponent {
  departmentId = '';
  roleId = '';
  roleEditForm!: FormGroup;
  formSubmitted = false;

  allPages: any[] = [];
  NewPermissions: any[] = [];
  selectedPermissions: any[] = [];
  RemovedPermissions: any[] = [];

  Permission:any[]=[];
  constructor(
    private apiService: RoleApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private pagesApiService: PagesApiService,
    private translationService: TranslationService,
  ) {
    this.roleEditForm = this.fb.group({
      roleName: ['', Validators.required],
      selectedPages: this.fb.array([]),
      checkAll: false,
    });
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.departmentId = params.get('departmentId') || '';
      this.roleId = params.get('roleId') || '';

      this.apiService.getRoleById(this.roleId).subscribe(
        (response: any) => {
          const role = response.data;
          this.selectedPermissions=response.data.
          premissions
          console.log('incomeing',this.selectedPermissions);

          if (role) {
             this.roleEditForm.patchValue({
              roleName: role.name
            }
            
            );
            this.loadPages()

          }
        },
        (error) => {
          console.error('Error fetching role details for edit:', error);
        }
      );
    });
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

        this.allPages.forEach((page) => {
          const isSelected = this.selectedPermissions.some(permission => permission.id === page.pageId);
          this.selectedPages.push(this.fb.control(isSelected));
        });
      },
      (error) => {
        console.error('Error loading pages', error);
      }
    );
  }



  submitForm(): void {
    this.formSubmitted = true;
    if (this.roleEditForm.valid) {
      const nameEn = this.roleEditForm.value.roleName;
      const ids: any[] = this.selectedPermissions.map(x => x.id);
      this.apiService.UpdateWithPermission(nameEn, this.roleId, this.departmentId,ids as []).subscribe(
        () => {

          this.router.navigate([`/admin/settings/roles/${this.departmentId}`]);
          this.openPopup();
        },
        (error) => {
          console.error('Error updating Role:', error);
        }
      );
    }
  }

 
  cancel(): void {
    this.router.navigate([`/admin/settings/roles/${this.departmentId}`]);
  }

  get selectedPages(): FormArray {
    return this.roleEditForm.get('selectedPages') as FormArray;
  }

  onChecked(event: any, id:any){
    const isChecked = (<HTMLInputElement>event.target).checked;

    console.log(isChecked)
    if (isChecked) {
      this.selectedPermissions.push({id:id});
     
    } else {
      const index = this.selectedPermissions.findIndex(permission => permission.id === id);
        if (index !== -1) {
          this.selectedPermissions.splice(index, 1);
        }
     
    }
  }
  onCheckAllChange(event: any) {
    const isChecked = event.target.checked;
    
    for (let i = 0; i < this.selectedPages.length; i++) {
      this.selectedPages.at(i).setValue(isChecked);
      const pageId = this.allPages[i].pageId;
      
      const isExisting = this.selectedPermissions.some(permission => permission.id === pageId);
  
      if (isChecked && !isExisting) {
        this.selectedPermissions.push({ id: pageId });
      } else if (!isChecked && isExisting) {
        const index = this.selectedPermissions.findIndex(permission => permission.id === pageId);
        if (index !== -1) {
          this.selectedPermissions.splice(index, 1);
        }
      }
    }
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

  // Get back to roles list
  getBackwardLink(): string {
    return `/admin/settings/roles/${this.departmentId}`;
  }

}
