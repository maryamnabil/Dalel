import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BackwardComponent } from '../../../shared/components/backward/backward.component';
import {
  TableComponent,
  TableConfigItem,
} from '../../../shared/components/table/table.component';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import { ProjectService } from 'src/app/shared/services/api/project.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocalizedNamePipe } from 'src/app/shared/pipes/localized-name.pipe';
import { SecureUrlPipe } from 'src/app/shared/pipes/secure-url.pipe';
import { getFileName } from 'src/app/core/helper/helper';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  imports: [
    TranslateModule,
    NgIf,
    NgFor,
    BackwardComponent,
    TableComponent,
    TableFiltersComponent,
    LocalizedNamePipe,
    AsyncPipe,
    SecureUrlPipe,
    NgClass,
  ],
  providers: [DatePipe],
})
export class ProjectDetailsComponent implements OnInit, AfterViewInit {
  backUrl = '/admin/projects/open-contacts';
  details: any;
  projectId: string;

  // Payment Terms Table
  paymentTermsTableConfig: TableConfigItem[];

  // Payment History Table
  paymentHistorySearchFilter = '';
  paymentHistoryPageIndex = 0;
  paymentHistoryPageSize = 10;
  paymentHistoryResponseData: any;
  paymentHistoryTableConfig: TableConfigItem[];

  @ViewChild('statusColumn')
  statusColumnTemplate: TemplateRef<any>;

  @ViewChild('paidByClientColumn')
  paidByClientColumnTemplate: TemplateRef<any>;

  @ViewChild('paidByAdminColumn')
  paidByAdminColumnTemplate: TemplateRef<any>;

  constructor(
    private apiService: ProjectService,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private translate: TranslateService,
    private helperService: HelperService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadDetails();
    this.setPaymentTermsTableConfig();
    this.setPaymentHistoryTableConfig();
    this.loadpaymentHistory();
  }

  ngAfterViewInit(): void {
    this.paymentTermsTableConfig = [
      ...this.paymentTermsTableConfig,
      {
        column: 'STATUS',
        value: (data) => {
          data?.status;
        },
        type: 'contentTemplate',
        contentTemplate: this.statusColumnTemplate,
      },
    ];
    this.paymentHistoryTableConfig = [
      ...this.paymentHistoryTableConfig,
      {
        column: 'PAID_BY_CLIENT',
        value: (data) => {
          data?.transaction_ByClientStatus;
        },
        type: 'contentTemplate',
        contentTemplate: this.paidByClientColumnTemplate,
      },
      {
        column: 'TRANSACTION_ID_DATE_BY_ADMIN',
        value: (data) =>
          data?.transaction_ByAdminID +
          '  ' +
          this.translate.instant('ON') +
          ' ' +
          this.datePipe.transform(data?.transaction_ByAdminDate, 'MM/dd/yyyy'),
      },
      {
        column: 'PAID_BY_ADMIN',
        value: (data) => {
          data?.transaction_ByAdminStatus;
        },
        type: 'contentTemplate',
        contentTemplate: this.paidByAdminColumnTemplate,
      },
    ];
    this.cdr.detectChanges();
  }

  loadDetails() {
    this.projectId = this.route.snapshot.params.id;
    this.projectService
      .getById(this.projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.details = res?.data;
      });
  }

  setPaymentTermsTableConfig() {
    this.paymentTermsTableConfig = [
      {
        column: 'TASK',
        value: (data) => data,
        type: 'textLocalized',
      },
      {
        column: 'TASK_DESCRIPTION',
        value: (data) => data,
        type: 'textLocalized',
        localizedKey: 'description',
      },
      {
        column: 'DEADLINE',
        value: (data) => data?.deadline,
        type: 'date',
      },
      {
        column: 'BUDGET',
        value: (data) => data?.budget + ' ' + this.translate.instant('SR'),
      },
    ];
  }

  // Payment History

  setPaymentHistoryTableConfig() {
    this.paymentHistoryTableConfig = [
      {
        column: 'TASK',
        value: (data) => data,
        type: 'textLocalized',
        localizedKey: 'taskName',
      },
      {
        column: 'TASK_DESCRIPTION',
        value: (data) => data,
        type: 'textLocalized',
        localizedKey: 'taskDescription',
      },
      {
        column: 'DEADLINE',
        value: (data) => data?.deadline,
        type: 'date',
      },
      {
        column: 'BUDGET',
        value: (data) => data?.budget,
      },
      {
        column: 'TRANSACTION_ID_DATE_BY_CLIENT',
        value: (data) =>
          data?.transaction_ByClientID +
          '  ' +
          this.translate.instant('ON') +
          ' ' +
          this.datePipe.transform(data?.transaction_ByClientDate, 'MM/dd/yyyy'),
      },
    ];
  }

  onPaymentHistoryPageChanged(event: any): void {
    this.paymentHistoryPageSize = event.pageSize;
    this.paymentHistoryPageIndex = event.pageIndex;
    this.loadpaymentHistory();
  }

  loadpaymentHistory() {
    this.apiService
      .loadPaymentHistory(
        +this.projectId,
        this.paymentHistoryPageIndex + 1,
        this.paymentHistoryPageSize
      )
      .subscribe(
        (response: any) => {
          this.paymentHistoryResponseData = response;
        },
        (error) => {
          console.error('Error loading City', error);
        }
      );
  }
  onOpenChat() {
    this.helperService.openChatPopup(this.details?.id);
  }

  getFileName(filePath: string) {
    if (!filePath) return '';
    return getFileName(filePath);
  }
}
