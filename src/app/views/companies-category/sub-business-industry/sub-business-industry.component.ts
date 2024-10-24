import { Component, DestroyRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupDeleteComponent } from 'src/app/shared/components/popup-delete/popup-delete.component';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { CategoryApiService } from 'src/app/shared/services/api/category.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateOptionsPipe } from '../../../shared/pipes/translate-options.pipe';
import { LocalizedNamePipe } from '../../../shared/pipes/localized-name.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-sub-business-industry',
  templateUrl: './sub-business-industry.component.html',
  styleUrls: ['./sub-business-industry.component.scss'],
  standalone: true,
  imports: [
    TableFiltersComponent,
    NgSelectModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    RouterLink,
    MatPaginatorModule,
    AsyncPipe,
    TranslateModule,
    LocalizedNamePipe,
    TranslateOptionsPipe,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class SubBusinessIndustryComponent {
  displayedColumns: string[] = ['nameEn', 'nameAr', 'category', 'actions'];
  dataSource = new MatTableDataSource();
  categories: any[] = [];

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 10;
  pageIndex = 0;
  totalRecords: number = 0;
  searchFilter = '';
  startDateFilter: string = '';
  endDateFilter: string = '';
  parentCategoryId: number | null = null;

  constructor(
    private apiService: CategoryApiService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit() {
    this.checkQueryParams();
    this.loadCategories();
  }

  checkQueryParams() {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = +params['id'];
        if (id) {
          this.parentCategoryId = id;
        }
        this.loadData();
      });
  }

  loadData() {
    this.apiService
      .getSubCategory(
        this.searchFilter,
        this.startDateFilter,
        this.endDateFilter,
        this.parentCategoryId?.toString() || '',
        this.pageIndex + 1,
        this.pageSize
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
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

  loadCategories() {
    this.apiService
      .getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.categories = res?.data;
      });
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

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.apiService
            .deleteCategory(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(
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
