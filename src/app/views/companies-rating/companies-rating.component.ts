import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

import {
  TableComponent,
  TableConfigItem,
} from 'src/app/shared/components/table/table.component';
import { TableFiltersComponent } from 'src/app/shared/components/table-filters/table-filters.component';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { ProjectService } from 'src/app/shared/services/api/project.service';

@Component({
  selector: 'app-companies-rating',
  standalone: true,
  templateUrl: './companies-rating.component.html',
  styleUrls: ['./companies-rating.component.scss'],
  imports: [
    TableFiltersComponent,
    NgIf,
    TranslateModule,
    TableComponent,
    StarRatingComponent,
  ],
})
export class CompaniesRatingComponent implements OnInit, AfterViewInit {
  tableConfig: TableConfigItem[] = [
    {
      column: 'PROJECT_ID',
      value: (data) => data?.projectId,
    },
    {
      column: 'PROJECT_NAME',
      value: (data) => data,
      type: 'textLocalized',
      localizedKey: 'projectName',
    },
    {
      column: 'COMPANY_NAME_CLIENT',
      value: (data) => data?.clientName,
    },
    {
      column: 'VENDOR_NAME',
      value: (data) => data?.vendorName,
      type: 'routeLink',
      routeLink: (data) =>
        `/admin/company-list/approved-details/${data?.vendorId}`,
    },
    {
      column: 'BUSINESS_INDUSTRY',
      value: (data) => data?.businessIndustry,
      type: 'textLocalized',
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
    private apiService: ProjectService,
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
      .loadCompanyRatings(
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
