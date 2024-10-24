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
import { HelperService } from 'src/app/shared/services/helper.service';
import { UserService } from 'src/app/shared/services/api/user.service';
import { UserStatusEnum } from 'src/app/core/enums/user-status.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isValidResponse } from 'src/app/core/helper/helper';

@Component({
  selector: 'app-blocked',
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
  templateUrl: './blocked.component.html',
  styleUrls: ['./blocked.component.scss'],
})
export class BlockedComponent implements OnInit, AfterViewInit {
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
      column: 'CITY',
      value: (data) => data?.city,
      type: 'textLocalized',
    },
    {
      column: 'COUNTRY',
      value: (data) => data?.countery,
      type: 'textLocalized',
    },
    {
      column: 'BLOCK_REASON',
      value: (data) => data?.rejectionORBlock_Reason,
    },
    {
      column: 'BLOCK_DATE',
      value: (data) => data?.rejectionORBlock_Date,
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
  startDateFilter: string = '';
  endDateFilter: string = '';

  @ViewChild('removeBlocktTemplate')
  removeBlocktTemplate: TemplateRef<any>;

  constructor(
    private apiService: UserService,
    private helperService: HelperService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.tableConfig = [
      ...this.tableConfig,
      {
        column: 'REMOVE_THE_BLOCK',
        value: () => {},
        type: 'contentTemplate',
        contentTemplate: this.removeBlocktTemplate,
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
        UserStatusEnum.Blocked,
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

  onRemoveBlock(element: any) {
    this.helperService
      .openConfirmPopup('CONFIRM_UPDATE')
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.removeBlock(element?.id);
        }
      });
  }

  removeBlock(userId: string) {
    this.userService
      .changeUserStatus(userId, UserStatusEnum.Approved)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (isValidResponse(res)) {
          this.openSuccessPopup('BLOCK_REMOVED_SUCCESSFULLY');
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
