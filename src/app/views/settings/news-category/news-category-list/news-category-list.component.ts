import { Component, OnInit } from '@angular/core';
import {
  TableConfigItem,
  TableComponent,
} from 'src/app/shared/components/table/table.component';
import { TableFiltersComponent } from '../../../../shared/components/table-filters/table-filters.component';
import { TranslateModule } from '@ngx-translate/core';
import { PopupDeleteComponent } from 'src/app/shared/components/popup-delete/popup-delete.component';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { MatDialog } from '@angular/material/dialog';
import { NewsCategoryApiService } from 'src/app/shared/services/api/news-category.service';

@Component({
  selector: 'app-news-category-list',
  standalone: true,
  imports: [TableFiltersComponent, TableComponent, TranslateModule],
  templateUrl: './news-category-list.component.html',
  styleUrls: ['./news-category-list.component.scss'],
})
export class NewsCategoryListComponent implements OnInit {
  tableConfig: TableConfigItem[] = [
    {
      column: 'TitleEN',
      value: (data) => data?.name,
    },
    {
      column: 'TitleAR',
      value: (data) => data?.nameAr,
    },
    {
      column: 'DESC_NAME_EN',
      value: (data) => data?.description,
    },
    {
      column: 'DESC_NAME_AR',
      value: (data) => data?.descriptionAr,
    },
  ];

  responseData: any;
  pageSize = 10;
  pageIndex = 0;
  searchFilter = '';
  startDateFilter: string = '';
  endDateFilter: string = '';

  constructor(
    private apiService: NewsCategoryApiService,
    private dialog: MatDialog
  ) {}

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
      .getNewsCategory(
        this.searchFilter,
        this.startDateFilter,
        this.endDateFilter,
        this.pageIndex + 1,
        this.pageSize
      )
      .subscribe(
        (response: any) => {
          this.responseData = response;
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
        message: 'SURE_TO_DELETE_NEWS',
        confirmButton: 'YES_DELETE',
        cancelButton: 'CANCEL',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.deleteNewsCategory(id).subscribe(
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
