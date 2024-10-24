import { Component, DestroyRef, OnInit } from '@angular/core';
import {
  TableConfigItem,
  TableComponent,
} from 'src/app/shared/components/table/table.component';
import { TableFiltersComponent } from '../../../../shared/components/table-filters/table-filters.component';
import { TranslateModule } from '@ngx-translate/core';
import { NewsApiService } from 'src/app/shared/services/api/news.service';
import { PopupDeleteComponent } from 'src/app/shared/components/popup-delete/popup-delete.component';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { MatDialog } from '@angular/material/dialog';
import { NewsCategoryApiService } from 'src/app/shared/services/api/news-category.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateOptionsPipe } from '../../../../shared/pipes/translate-options.pipe';
import { AsyncPipe } from '@angular/common';
import { LocalizedNamePipe } from 'src/app/shared/pipes/localized-name.pipe';
import { ActivatedRoute } from '@angular/router';
import { TranslationService } from 'src/app/shared/services/translation.service';

@Component({
  selector: 'app-news-list',
  standalone: true,
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss'],
  imports: [
    TableFiltersComponent,
    TableComponent,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    TranslateOptionsPipe,
    AsyncPipe,
    LocalizedNamePipe,
  ],
})
export class NewsListComponent implements OnInit {
  tableConfig: TableConfigItem[] = [
    {
      column: 'NEWS_CATEGORY',
      value: (data) =>
        this.translationService.getCurrentLanguage() === 'en'
          ? data?.newsCategory?.name
          : data?.newsCategory?.nameAr,
    },
    {
      column: 'TitleEN',
      value: (data) => data?.titleEn,
    },
    {
      column: 'TitleAR',
      value: (data) => data?.titleAr,
    },
  ];
  categories: any[] = [];
  categoryId: number | null = null;

  responseData: any;
  pageSize = 10;
  pageIndex = 0;
  searchFilter = '';
  startDateFilter: string = '';
  endDateFilter: string = '';

  constructor(
    private apiService: NewsApiService,
    private dialog: MatDialog,
    private newsCategoryService: NewsCategoryApiService,
    private destroyRef: DestroyRef,
    private route: ActivatedRoute,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.checkParams();
    this.loadCategories();
  }

  checkParams() {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = +params['id'];
        if (id) {
          this.categoryId = id;
        }
        this.loadData();
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

  loadData() {
    this.apiService
      .getNews(
        this.categoryId?.toString() || '',
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

  loadCategories() {
    this.newsCategoryService
      .getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.categories = res?.data;
      });
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
        this.apiService.deleteNews(id).subscribe(
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
