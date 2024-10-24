import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import {
  TableComponent,
  TableConfigItem,
} from 'src/app/shared/components/table/table.component';
import { TitleStatusCardComponent } from '../../../shared/components/title-status-card/title-status-card.component';
import { NgTemplateOutlet } from '@angular/common';
import { ProjectService } from 'src/app/shared/services/api/project.service';
import { ProjectStatus } from 'src/app/core/enums/project-status.enum';

@Component({
  selector: 'app-complete-projects',
  standalone: true,
  imports: [
    TableFiltersComponent,
    TranslateModule,
    TableComponent,
    TitleStatusCardComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './complete-projects.component.html',
  styleUrls: ['./complete-projects.component.scss'],
})
export class CompleteProjectsComponent implements OnInit {
  tableConfig: TableConfigItem[] = [
    {
      column: 'COMPANY_NAME_CLIENT',
      value: (data) => data?.clientName,
    },
    {
      column: 'COMPANY_NAME_VENDOR',
      value: (data) => data?.vendorName,
    },
    {
      column: 'BUSINESS_INDUSTRY',
      value: (data) => data?.businessIndustry,
    },
    {
      column: 'SUBMITTED_PRICE',
      value: (data) =>
        data?.submittedPrice + ' ' + this.translate.instant('SR'),
    },
    {
      column: 'PROJECT_DURATION',
      value: (data) =>
        this.translate.instant('MAXIMUM') +
        ' ' +
        data?.duration +
        ' ' +
        this.translate.instant('WEEEKS'),
    },
  ];

  responseData: any;
  pageSize = 10;
  pageIndex = 0;
  searchFilter = '';
  startDateFilter: string = '';
  endDateFilter: string = '';

  constructor(
    private apiService: ProjectService,
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
      .loadProjects(
        ProjectStatus.Completed,
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
