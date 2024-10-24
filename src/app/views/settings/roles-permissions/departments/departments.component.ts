import { Component, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DeptApiService } from 'src/app/shared/services/api/departments.service';

import { TranslationService } from 'src/app/shared/services/translation.service';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { PopupDeleteComponent } from 'src/app/shared/components/popup-delete/popup-delete.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { TableFiltersComponent } from '../../../../shared/components/table-filters/table-filters.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
  standalone: true,
  imports: [
    TableFiltersComponent,
    MatTableModule,
    MatSortModule,
    RouterLink,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
    TranslateModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class DepartmentsComponent {
  displayedColumns: string[] = ['departmentName', 'employeesCount', 'actions'];
  dataSource = new MatTableDataSource();

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 10;
  pageIndex = 0;
  searchFilter: string = '';
  startDateFilter = '';
  endDateFilter = '';
  totalRecords: number = 0;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private apiService: DeptApiService,
    private translationService: TranslationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadDepartments();

    this.translationService.currentLanguage$.subscribe(() =>
      this.loadDepartments()
    );
  }

  // Pagination
  onPageChanged(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadDepartments();
  }
  // Date Filter
  onDateRangeFilterApplied(event: { fromDate: string; toDate: string }): void {
    this.startDateFilter = event.fromDate;
    this.endDateFilter = event.toDate;
    this.loadDepartments();
  }
  /* List Departments */
  loadDepartments() {
    // console.log('Data in component:', response.data);
    console.log(this.pageIndex, this.totalRecords);

    const currentLanguage = this.translationService.getCurrentLanguage();

    this.apiService
      .getDepartments(
        this.startDateFilter,
        this.endDateFilter,
        this.searchFilter,
        this.pageIndex + 1,
        this.pageSize
      )
      .subscribe(
        (response: any) => {
          this.totalRecords = response.pagination.totalRecords;
          const DEPARTMENTS_DATA = response.data.map((department: any) => ({
            departmentId: department.id,
            departmentName:
              currentLanguage === 'en' ? department.name : department.nameAr,
            employeesCount: department.numberOUsers as number,
          }));
          // console.log(DEPARTMENTS_DATA);

          this.dataSource = DEPARTMENTS_DATA;
          this.dataSource.paginator = this.paginator;

          console.log(response);
          console.log(this.totalRecords);
        },
        (error) => {
          console.error('Error loading departments', error);
        }
      );
  }

  /* Delete Department */
  deleteDepartment(departmentId: number): void {
    const dialogRef = this.dialog.open(PopupDeleteComponent, {
      width: '400px',
      data: {
        title: 'CONFIRM_DELETE',
        message: 'DEPT_DELETE_MSG',
        confirmButton: 'YES_DELETE',
        cancelButton: 'CANCEL',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.deleteDepartment(departmentId).subscribe(
          () => {
            this.openPopup();
            this.loadDepartments();
          },
          (error) => {
            console.error('Error deleting department:', error);
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
}
