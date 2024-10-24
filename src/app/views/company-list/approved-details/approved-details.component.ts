import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CompanyDetailsComponent } from 'src/app/shared/components/company-details/company-details.component';
import { BackwardComponent } from '../../../shared/components/backward/backward.component';
import { TranslateModule } from '@ngx-translate/core';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import {
  TableComponent,
  TableConfigItem,
} from '../../../shared/components/table/table.component';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { UserService } from 'src/app/shared/services/api/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/shared/services/api/project.service';
import { ProjectStatus } from 'src/app/core/enums/project-status.enum';
import { HelperService } from 'src/app/shared/services/helper.service';
import { WalletService } from 'src/app/shared/services/api/wallet.service';
import { isValidResponse } from 'src/app/core/helper/helper';

@Component({
  selector: 'app-approved-details',
  standalone: true,
  templateUrl: './approved-details.component.html',
  styleUrls: ['./approved-details.component.scss'],
  imports: [
    CompanyDetailsComponent,
    BackwardComponent,
    TranslateModule,
    TableFiltersComponent,
    TableComponent,
    StarRatingComponent,
  ],
})
export class ApprovedDetailsComponent implements OnInit, AfterViewInit {
  backUrl = '/admin/company-list/approved';
  companyDetails: any;
  userWallet: any;
  userId: string;

  // Projects History Table
  projectSearchFilter = '';
  projectPageIndex = 0;
  projectPageSize = 10;
  projectsResponseData: any;
  projectsTableConfig: TableConfigItem[];

  // Posted Biddings Table
  biddingsSearchFilter = '';
  biddingsPageIndex = 0;
  biddingsPageSize = 10;
  biddingsResponseData: any;
  biddingsTableConfig: TableConfigItem[];

  @ViewChild('statusColumn')
  statusColumnTemplate: TemplateRef<any>;

  constructor(
    private apiService: ProjectService,
    private crd: ChangeDetectorRef,
    private userService: UserService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private helperService: HelperService,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params?.id;
    this.getCompanyDetails();
    this.getUserWallet();
    this.setProjectsTableConfig();
    this.setBiddingsTableConfig();
    this.loadProjectHistory();
    this.loadBiddings();
  }

  ngAfterViewInit(): void {
    this.projectsTableConfig = [
      ...this.projectsTableConfig,
      {
        column: 'STATUS',
        value: (data) => {
          data?.status;
        },
        type: 'contentTemplate',
        contentTemplate: this.statusColumnTemplate,
      },
    ];
    this.crd.detectChanges();
  }

  getCompanyDetails() {
    this.userService
      .getUserDetails(this.userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.companyDetails = res?.data;
      });
  }

  getUserWallet() {
    this.walletService
      .getUserWallet(this.userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.userWallet = res?.data;
      });
  }

  setProjectsTableConfig() {
    this.projectsTableConfig = [
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
        value: (data) => data?.submittedPrice,
      },
      {
        column: 'PROJECT_DURATION',
        value: (data) => data?.duration,
      },
    ];
  }

  // Search
  onSearchProjecstHistory(event: string): void {
    this.projectSearchFilter = event;
    this.loadProjectHistory();
  }

  onProjectsPageChanged(event: any): void {
    this.projectPageSize = event.pageSize;
    this.projectPageIndex = event.pageIndex;
    this.loadProjectHistory();
  }

  loadProjectHistory() {
    this.apiService
      .loadProjects(
        '',
        this.projectSearchFilter,
        '',
        '',
        this.projectPageIndex + 1,
        this.projectPageSize,
        this.userId
      )
      .subscribe(
        (response: any) => {
          this.projectsResponseData = response;
        },
        (error) => {
          console.error('Error loading City', error);
        }
      );
  }

  // Posted Biddings Table

  setBiddingsTableConfig() {
    this.biddingsTableConfig = [
      {
        column: 'COMPANY_NAME_CLIENT',
        value: (data) => data?.clientName,
      },
      {
        column: 'BUSINESS_INDUSTRY',
        value: (data) => data?.businessIndustry,
      },
      {
        column: 'SUBMITTED_PRICE',
        value: (data) => data?.submittedPrice,
      },
      {
        column: 'PROJECT_DURATION',
        value: (data) => data?.duration,
      },
    ];
  }

  // Search
  onSearchBiddings(event: string): void {
    this.biddingsSearchFilter = event;
    this.loadBiddings();
  }

  onBiddingsPageChanged(event: any): void {
    this.biddingsPageSize = event.pageSize;
    this.biddingsPageIndex = event.pageIndex;
    this.loadBiddings();
  }

  loadBiddings() {
    this.apiService
      .loadProjects(
        ProjectStatus.Open,
        this.biddingsSearchFilter,
        '',
        '',
        this.biddingsPageIndex + 1,
        this.biddingsPageSize,
        this.userId
      )
      .subscribe(
        (response: any) => {
          this.biddingsResponseData = response;
        },
        (error) => {
          console.error('Error loading City', error);
        }
      );
  }

  // RECHARGE ACCOUNT
  onRecharge() {
    this.helperService
      .openRechargeAccountPopup()
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const { amount, desc } = result;
          const userId = this.route.snapshot.params.id;
          this.rechargeAccount(userId, amount, desc);
        }
      });
  }

  rechargeAccount(userId: string, amount: number, desc: string) {
    this.walletService
      .addTransaction(userId, amount, desc)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (isValidResponse(res)) {
          this.openSuccessPopup('ACCOUNT_RECHARGED_SUCCESSFULLY');
        }
      });
  }

  openSuccessPopup(msg: string) {
    this.helperService
      .openSuccessPopup(msg)
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getCompanyDetails();
      });
  }
}
