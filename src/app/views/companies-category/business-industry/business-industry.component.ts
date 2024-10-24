import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupDeleteComponent } from 'src/app/shared/components/popup-delete/popup-delete.component';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { CategoryApiService } from 'src/app/shared/services/api/category.service';
import { SecureUrlPipe } from '../../../shared/pipes/secure-url.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-business-industry',
  templateUrl: './business-industry.component.html',
  styleUrls: ['./business-industry.component.scss'],
  standalone: true,
  imports: [
    TableFiltersComponent,
    MatTableModule,
    MatSortModule,
    NgIf,
    MatMenuModule,
    MatIconModule,
    RouterLink,
    MatPaginatorModule,
    AsyncPipe,
    TranslateModule,
    SecureUrlPipe,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class BusinessIndustryComponent {
  displayedColumns: string[] = ['nameEn', 'nameAr', 'photo', 'actions'];
  dataSource = new MatTableDataSource();

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 10;
  pageIndex = 0;
  totalRecords: number = 0;
  searchFilter = '';
  startDateFilter: string = '';
  endDateFilter: string = '';

  constructor(
    private apiService: CategoryApiService,
    private dialog: MatDialog
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit() {
    this.loadData();
  }

  // Pagination
  onPageChanged(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadData();
  }

  // Search
  onSearchChanged(event: string): void {
    this.searchFilter = event;
    this.loadData();
  }

  onDateRangeFilterApplied(event: { fromDate: string; toDate: string }): void {
    this.startDateFilter = event.fromDate;
    this.endDateFilter = event.toDate;
    this.loadData();
  }

  loadData() {
    this.apiService
      .getCategory(
        this.searchFilter,
        this.startDateFilter,
        this.endDateFilter,
        this.pageIndex + 1,
        this.pageSize
      )
      .subscribe(
        (response: any) => {
          this.totalRecords = response.pagination.totalRecords;
          this.dataSource = response?.data;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Error loading City', error);
        }
      );
  }

  delete(id: number): void {
    const dialogRef = this.dialog.open(PopupDeleteComponent, {
      width: '400px',
      data: {
        title: 'CONFIRM_DELETE',
        message: 'CAT_DELETE_MSG',
        confirmButton: 'YES_DELETE',
        cancelButton: 'CANCEL',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.deleteCategory(id).subscribe(
          () => {
            this.openPopup();
            this.loadData();
          },
          (error) => {
            console.error('Error deleting role:', error);
          }
        );
      }
    });
  }

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
