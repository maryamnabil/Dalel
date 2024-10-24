import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { SecureUrlPipe } from '../../../shared/pipes/secure-url.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf, AsyncPipe, DatePipe } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  TableComponent,
  TableConfigItem,
} from 'src/app/shared/components/table/table.component';
import { UserService } from 'src/app/shared/services/api/user.service';
import { UserStatusEnum } from 'src/app/core/enums/user-status.enum';
import { HelperService } from 'src/app/shared/services/helper.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isValidResponse } from 'src/app/core/helper/helper';

@Component({
  selector: 'app-approved',
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
    DatePipe,
  ],
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.scss'],
})
export class ApprovedComponent implements OnInit, AfterViewInit {
  tableConfig: TableConfigItem[] = [
    {
      column: 'COMPANY_NAME_CLIENT',
      value: (data) => data?.fullName,
    },
    {
      column: 'PHONE_NUMBER',
      value: (data) => data?.phoneNumber,
    },
    {
      column: 'BUSINESS_INDUSTRY',
      value: (data) => data?.businessIndustry,
    },
    {
      column: 'EMAIL',
      value: (data) => data?.email,
    },
    {
      column: 'CITY',
      value: (data) => data?.city,
      type: 'textLocalized',
    },
  ];

  responseData: any;
  pageSize = 10;
  pageIndex = 0;
  searchFilter = '';
  startDateFilter: string = '';
  endDateFilter: string = '';

  @ViewChild('crCertificateTemplate')
  crCertificateTemplate: TemplateRef<any>;

  @ViewChild('blockTemplate')
  blockTemplate: TemplateRef<any>;

  constructor(
    private apiService: UserService,
    private cdr: ChangeDetectorRef,
    private helperService: HelperService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.tableConfig = [
      ...this.tableConfig,

      {
        column: 'CR_CERTIFICATE',
        value: () => {},
        type: 'contentTemplate',
        contentTemplate: this.crCertificateTemplate,
      },
      {
        column: 'BLOCK_COMPANY',
        value: () => {},
        type: 'contentTemplate',
        contentTemplate: this.blockTemplate,
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
      .getUsers(
        UserStatusEnum.Approved,
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

  onBlock(element: any) {
    this.helperService
      .openTextInputPopup('BLOCK_REASON', 'REASON')
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.block(element?.id, result);
        }
      });
  }

  block(userId: string, reason: string) {
    this.apiService
      .changeUserStatus(userId, UserStatusEnum.Blocked, reason)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (isValidResponse(res)) {
          this.openSuccessPopup('COMPANY_BLOCKED_SUCCESSFULLY');
        }
      });
  }

  openSuccessPopup(msg: string) {
    this.helperService
      .openSuccessPopup(msg)
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadData();
      });
  }
}
