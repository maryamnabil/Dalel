import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { SecureUrlPipe } from '../../../shared/pipes/secure-url.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  TableComponent,
  TableConfigItem,
} from 'src/app/shared/components/table/table.component';
import { UserService } from 'src/app/shared/services/api/user.service';
import { CrStatusEnum } from 'src/app/core/enums/cr-status.enum';

@Component({
  selector: 'app-cr-expirations',
  standalone: true,
  imports: [
    TableFiltersComponent,
    MatTableModule,
    MatSortModule,
    NgIf,
    MatMenuModule,
    MatIconModule,
    RouterLink,
    AsyncPipe,
    TranslateModule,
    SecureUrlPipe,
    MatDatepickerModule,
    MatNativeDateModule,
    TableComponent,
  ],
  templateUrl: './cr-expirations.component.html',
  styleUrls: ['./cr-expirations.component.scss'],
})
export class CrExpirationsComponent implements OnInit {
  tableConfig: TableConfigItem[] = [
    {
      column: 'COMPANY_NAME_CLIENT',
      value: (data) => data?.fullName,
    },
    {
      column: 'BUSINESS_INDUSTRY',
      value: (data) => data?.businessIndustry,
    },
    {
      column: 'EXPIRATION_DATE',
      value: (data) => data?.cr?.expiredDate,
      type: 'date',
    },
    {
      column: 'CR_CERTIFICATE',
      value: () => this.translate.instant('CERTIFICATE'),
      class: 'text-primary text-underline',
      type: 'link',
      link: (data) => data?.cr?.photo,
    },
  ];

  responseData: any;
  pageSize = 10;
  pageIndex = 0;
  searchFilter = '';
  startDateFilter = '';
  endDateFilter = '';

  constructor(
    private apiService: UserService,
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
      .loadCRs(
        CrStatusEnum.Expired,
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
