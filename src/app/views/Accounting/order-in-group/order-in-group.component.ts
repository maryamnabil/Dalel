import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionApiService } from 'src/app/shared/services/api/subscription.service';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import {
  MatCheckbox,
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { AccountingPopUpComponent } from '../accounting-pop-up/accounting-pop-up.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { OrdersGroupService } from 'src/app/shared/services/orders-group.service';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
  selector: 'app-order-in-group',
  templateUrl: './order-in-group.component.html',
  styleUrls: ['./order-in-group.component.scss'],
  standalone: true,
  imports: [
    TableFiltersComponent,
    MatTableModule,
    MatCheckboxModule,
    TranslateModule,
    MatPaginatorModule,
    NgClass,
  ],
})
export class OrderInGroupComponent implements OnInit {
  displayedColumns: string[] = [
    'selectAll',
    'paymentId',
    'createdDate',
    'companyName',
    'vendorName',
    'vendorPhone',
    'commission',
    'totalPrice',
    'problem',
    'status',
  ];
  dataSource: any;

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 10;
  pageIndex = 0;

  subscriptionType: number = 2;

  allChecked: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('selectAllCheckbox') selectAllCheckbox!: MatCheckbox;

  totalRecords!: number;
  routingPath = '';
  searchFilter: string = '';
  startDateFilter: string = '';
  endDateFilter: string = '';
  selectedPaymentIds: string[] = [];
  ordersData: any[] = [];
  groupId!: string;
  isPaid: string = '';
  isProblem: string = '';
  groupName: string = '';

  get allItemsPaid() {
    return this.ordersData?.every((item: any) => item.isPaid_FromAdmin);
  }

  OnAccountStatus(event: any) {
    if (event == '') {
      this.isPaid = '';
      this.isProblem = '';
    }
    if (event == 1) {
      this.isPaid = 'true';
      this.isProblem = '';
    }
    if (event == 2) {
      this.isPaid = 'false';
      this.isProblem = '';
    }
    if (event == 3) {
      this.isPaid = '';
      this.isProblem = 'true';
    }
    this.loadOrders();
  }

  AddPaymentProblem() {
    this.openPopup();
  }
  @ViewChild('checkAllCheckbox') checkAllCheckbox!: MatCheckbox;

  selectAllRows(checked: boolean) {
    if (checked) {
      this.allChecked = true;
      console;
      this.selectedPaymentIds = this.dataSource.map((row: any) => row.termId);
    } else {
      this.allChecked = false;
      this.selectedPaymentIds = [];
    }
  }

  selectRow(
    event: MatCheckboxChange,
    termId: string,
    checkAllChecked: boolean
  ) {
    if (checkAllChecked) {
      if (event.checked) {
        this.selectedPaymentIds.push(termId);
      } else {
        const index = this.selectedPaymentIds.indexOf(termId);
        if (index !== -1) {
          this.selectedPaymentIds.splice(index, 1);
        }
      }
    } else {
      if (event.checked) {
        this.selectedPaymentIds.push(termId);
      } else {
        const index = this.selectedPaymentIds.indexOf(termId);
        if (index !== -1) {
          this.selectedPaymentIds.splice(index, 1);
        }
      }
    }
  }

  constructor(
    private apiService: OrdersGroupService,
    private translationService: TranslationService,
    private dialog: MatDialog,
    private dialogRef: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private helperService: HelperService
  ) {}
  onPayAll() {
    if (this.allItemsPaid) {
      return;
    }
    this.apiService.ConfirmPaidByOrders(this.selectedPaymentIds).subscribe(
      (response: any) => {
        if (response && response.statusCode === 200) {
          this.selectedPaymentIds = [];
          this.loadOrders();
          this.sucessPopUp();
        } else {
          console.error('Error:', response);
        }
      },
      (error: any) => {
        console.error('Error add new Group:', error);
      }
    );
  }

  sucessPopUp(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '300px',
      data: {
        title: 'Suceess',
        message: 'SUCCESS',
        button: 'CLOSE',
      },
    });
  }
  openPopup(): void {
    const dialogRef = this.dialog.open(AccountingPopUpComponent, {
      width: '400px',
      data: {
        title: 'PAYMENT_PROBLEM',
        message: 'Comment',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService
          .markOrdersWithIssue(this.selectedPaymentIds, result)
          .subscribe((response: any) => {
            if (response && response.statusCode === 200) {
              this.selectedPaymentIds = [];
              this.helperService.openSuccessPopup('SUCCESS');
              this.loadOrders();
            }
          });
      }
    });
  }

  loadOrders(): void {
    const currentLanguage = this.translationService.getCurrentLanguage();

    this.apiService
      .getOrdersInGroup(
        this.pageIndex + 1,
        this.pageSize,
        this.startDateFilter,
        this.endDateFilter,
        this.isPaid,
        this.searchFilter,
        this.groupId,
        this.isProblem
      )
      .subscribe((response: any) => {
        this.ordersData = response?.data;
        this.totalRecords = response.pagination?.totalRecords;
        this.dataSource = this.ordersData;
        this.dataSource.paginator = this.paginator;
      });
  }
  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.groupId = params.get('id') || '';
      this.groupName = params.get('groupName') || '';
      this.groupName = this.groupName.replace('%20', ' ');
      this.loadOrders();
    });
  }

  applyFilter(event: any): void {
    this.searchFilter = event;
    this.loadOrders();
  }

  onPageChanged(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadOrders();
  }

  onSearchChanged(event: string): void {
    this.searchFilter = event;
    this.loadOrders();
  }

  onDateRangeFilterApplied(event: { fromDate: string; toDate: string }): void {
    this.startDateFilter = event.fromDate;
    this.endDateFilter = event.toDate;
    this.loadOrders();
  }
}
