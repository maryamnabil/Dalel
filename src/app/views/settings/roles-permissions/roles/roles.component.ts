import { Component, ViewChild } from '@angular/core';
import { formatDate, NgFor, NgIf } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslationService } from 'src/app/shared/services/translation.service';

import { RoleApiService } from 'src/app/shared/services/api/roles.service';
import { DeptApiService } from 'src/app/shared/services/api/departments.service';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { TableFiltersComponent } from '../../../../shared/components/table-filters/table-filters.component';
import { PopupDeleteComponent } from 'src/app/shared/components/popup-delete/popup-delete.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  standalone: true,
  imports: [
    TableFiltersComponent,
    MatTableModule,
    MatSortModule,
    NgFor,
    NgIf,
    MatMenuModule,
    MatIconModule,
    RouterLink,
    MatPaginatorModule,
    TranslateModule,
    MatDialogModule,
  ],
})
export class RolesComponent {
  departmentId = '';
  departmentName = '';

  displayedColumns: string[] = [
    'roleName',
    'roleAssigned',
    'employeesCount',
    'actions',
  ];
  dataSource = new MatTableDataSource();
  totalRecoreds = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 10;
  pageIndex = 0;
  totalRecords!: number;

  startDateFilter: string | null = null;
  endDateFilter: string | null = null;
  startDateFormated = '';
  endDateFormated = '';

  searchFilter = '';
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private apiService: RoleApiService,
    private deptApiService: DeptApiService,
    private translationService: TranslationService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.departmentId = this.route.snapshot.paramMap.get('departmentId') || '';
    this.translationService.currentLanguage$.subscribe(() => this.loadRoles());
    this.translationService.currentLanguage$.subscribe(() => this.getTitle());

    this.loadRoles();
    this.getTitle();
  }

  // Pagination
  onPageChanged(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadRoles();
  }

  // Search
  onSearchChanged(event: string): void {
    this.searchFilter = event;
    this.loadRoles();
  }

  // Date Filter
  onDateRangeChanged(event: { fromDate: string; toDate: string }): void {
    this.startDateFilter = event.fromDate;
    this.endDateFilter = event.toDate;
    this.loadRoles();
  }

  // Get Title
  getTitle() {
    this.deptApiService.getDepartmentById(this.departmentId).subscribe(
      (response: any) => {
        const currentLanguage = this.translationService.getCurrentLanguage();
        this.departmentName =
          currentLanguage === 'en' ? response.data.name : response.data.nameAr;
      },
      (error) => {
        console.error('Error fetching Department details:', error);
      }
    );
  }

  loadRoles() {
    const currentLanguage = this.translationService.getCurrentLanguage();
    this.apiService
      .getRoles(
        this.departmentId,
        this.pageIndex + 1,
        this.pageSize,
        this.startDateFormated,
        this.endDateFormated,
        this.searchFilter
      )
      .subscribe(
        (response: any) => {
          const roles = response.data;
          this.totalRecords = response.pagination.totalRecords;

          const ROLES_DATA = roles.map((role: any) => {
            const permissions = role.premissions || [];
            const roleData = {
              roleId: role.id,
              roleName: role.name,
              employeesCount: role.numberOfUserInRole as number,
              roleAssigned: permissions.map(
                (permission: any, index: number, array: any[]) => ({
                  name:
                    currentLanguage === 'en'
                      ? permission.name
                      : permission.nameAr,
                  last: index === array.length - 1,
                })
              ),
            };
            return roleData;
          });

          this.dataSource = ROLES_DATA;

          console.log(this.dataSource.data);
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Error loading roles', error);
        }
      );
  }

  /* Delete Role */
  deleteRole(roleId: number): void {
    const dialogRef = this.dialog.open(PopupDeleteComponent, {
      width: '400px',
      data: {
        title: 'CONFIRM_DELETE',
        message: 'ROLE_DELETE_MSG',
        confirmButton: 'YES_DELETE',
        cancelButton: 'CANCEL',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.deleteRole(roleId).subscribe(
          () => {
            this.openPopup();
            this.loadRoles();
          },
          (error) => {
            console.error('Error deleting role:', error);
          }
        );
      }
    });
  }

  // Success Popup
  openPopup(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '300px',
      data: {
        message: 'DELETED',
        button: 'CLOSE',
      },
    });
  }

  getAddLink(): string {
    return `/admin/settings/role-add/${this.departmentId}`;
  }
}
