import { Component, DestroyRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupDeleteComponent } from 'src/app/shared/components/popup-delete/popup-delete.component';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { SkillsApiService } from 'src/app/shared/services/api/skills.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryApiService } from 'src/app/shared/services/api/category.service';
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
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
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
export class SkillsComponent {
  displayedColumns: string[] = ['nameEn', 'nameAr', 'actions'];
  dataSource = new MatTableDataSource();
  subCategories: any[] = [];

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 10;
  pageIndex = 0;
  totalRecords: number = 0;
  searchFilter = '';
  subCatId: number | null = null;
  startDateFilter: string = '';
  endDateFilter: string = '';

  constructor(
    private apiService: SkillsApiService,
    private categoryApiService: CategoryApiService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit() {
    this.checkQueryParams();
    this.loadSubCategories();
  }

  checkQueryParams() {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = +params['id'];
        if (id) {
          this.subCatId = id;
        }
        this.loadData();
      });
  }

  loadData() {
    this.apiService
      .getSkills(
        this.searchFilter,
        this.subCatId?.toString() || '',
        this.startDateFilter,
        this.endDateFilter,
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

  loadSubCategories() {
    this.categoryApiService
      .getAllSubCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.subCategories = res?.data;
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
        message: 'SURE_TO_DELETE_THIS_SKILL',
        confirmButton: 'YES_DELETE',
        cancelButton: 'CANCEL',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.apiService.deleteSkill(id).subscribe(
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
