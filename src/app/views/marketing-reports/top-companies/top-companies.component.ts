import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import {
  TableComponent,
  TableConfigItem,
} from 'src/app/shared/components/table/table.component';
import { TitleStatusCardComponent } from '../../../shared/components/title-status-card/title-status-card.component';
import { NgTemplateOutlet } from '@angular/common';
import { MarketingReportsService } from 'src/app/shared/services/api/marketing-reports.service';

@Component({
  selector: 'app-top-companies',
  standalone: true,
  imports: [
    TableFiltersComponent,
    TranslateModule,
    TableComponent,
    TitleStatusCardComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './top-companies.component.html',
  styleUrls: ['./top-companies.component.scss'],
})
export class TopCompaniesComponent implements OnInit {
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

  constructor(
    private apiService: MarketingReportsService,
    private translate: TranslateService
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
      .getTopCompanies(
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
