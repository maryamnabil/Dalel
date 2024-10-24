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
import { NgIf, AsyncPipe, JsonPipe, DatePipe } from '@angular/common';
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
import { CrStatusEnum } from 'src/app/core/enums/cr-status.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isValidResponse } from 'src/app/core/helper/helper';

@Component({
  selector: 'app-cr-approvals',
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
    JsonPipe,
    DatePipe,
  ],
  templateUrl: './cr-approvals.component.html',
  styleUrls: ['./cr-approvals.component.scss'],
})
export class CrApprovalsComponent implements OnInit, AfterViewInit {
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
      column: 'SUBMISSION_DATE',
      value: (data) => data?.cr?.submitedDate,
      type: 'date',
    },
  ];

  responseData: any;
  pageSize = 10;
  pageIndex = 0;
  searchFilter = '';
  startDateFilter: string = '';
  endDateFilter: string = '';

  @ViewChild('approveDeclineActionBtns')
  approveDeclineActionBtns: TemplateRef<any>;

  @ViewChild('crCertificateTemplate')
  crCertificateTemplate: TemplateRef<any>;

  constructor(
    private apiService: UserService,
    private helperService: HelperService,
    private cdr: ChangeDetectorRef,
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
      .loadCRs(
        CrStatusEnum.Approved,
        this.searchFilter,
        this.startDateFilter,
        this.endDateFilter,
        this.pageIndex + 1,
        this.pageSize
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (response: any) => {
          this.responseData = response;
        },
        (error) => {
          console.error('Error loading City', error);
        }
      );
  }

  onApprove(element: any) {
    this.helperService
      .openConfirmPopup('CONFIRM_UPDATE')
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.apiService
            .changeCRStatus(element?.id, CrStatusEnum.Approved)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((res) => {
              if (isValidResponse(res)) {
                this.openSuccessPopup('CR_APPROVED_SUCCESSFULLY');
              }
            });
        }
      });
  }

  onDecline(element: any) {
    this.helperService
      .openTextInputPopup('DECLINE_REASON', 'DESCRIBE_THE_REASON')
      .afterClosed()
      .subscribe((rejectionReason) => {
        if (rejectionReason) {
          this.apiService
            .changeCRStatus(element?.id, CrStatusEnum.Rejected, rejectionReason)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((res) => {
              if (isValidResponse(res)) {
                this.openSuccessPopup('CR_REJECTED_SUCCESSFULLY');
              }
            });
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
