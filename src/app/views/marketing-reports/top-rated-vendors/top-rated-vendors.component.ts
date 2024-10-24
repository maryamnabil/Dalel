import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import {
  TableComponent,
  TableConfigItem,
} from 'src/app/shared/components/table/table.component';
import { TitleStatusCardComponent } from '../../../shared/components/title-status-card/title-status-card.component';
import { NgTemplateOutlet } from '@angular/common';
import { MarketingReportsService } from 'src/app/shared/services/api/marketing-reports.service';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-top-rated-vendors',
  standalone: true,
  imports: [
    TableFiltersComponent,
    TranslateModule,
    TableComponent,
    TitleStatusCardComponent,
    NgTemplateOutlet,
    StarRatingComponent,
  ],
  templateUrl: './top-rated-vendors.component.html',
  styleUrls: ['./top-rated-vendors.component.scss'],
})
export class TopRatedVendorsComponent implements OnInit, AfterViewInit {
  tableConfig: TableConfigItem[] = [
    {
      column: 'CATEGORY_NAME',
      value: (data) => data?.categoryName,
    },
    {
      column: 'NO_OF_PROJECTS',
      value: (data) => data?.noOfProjects,
    },
    {
      column: 'PHONE_NUMBER',
      value: (data) => data?.phoneNumber,
    },
    {
      column: 'TOTAL_PROJECTS_PRICE',
      value: (data) => data?.totalProjectsPrice,
    },
  ];

  responseData: any;
  pageSize = 10;
  pageIndex = 0;
  searchFilter = '';
  startDateFilter: string = '';
  endDateFilter: string = '';

  @ViewChild('ratingTemplate')
  ratingTemplate: TemplateRef<any>;

  constructor(
    private apiService: MarketingReportsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.tableConfig = [
      ...this.tableConfig,
      {
        column: 'RATING',
        value: () => {},
        type: 'contentTemplate',
        contentTemplate: this.ratingTemplate,
      },
    ];
    this.cdr.detectChanges();
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
      .getTopRatedVendors(
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
}
