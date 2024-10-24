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
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-fixed-payment',
  templateUrl: './fixed-payment.component.html',
  styleUrls: ['./fixed-payment.component.scss'],
  standalone: true,
  imports: [
    TableFiltersComponent,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    TranslateModule,
    DatePipe,
  ],
})
export class FixedPaymentComponent implements OnInit {
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
  ExportedFile: any;

  ExportToBank(): void {
    this.apiService
      .ExportByOrders(this.selectedPaymentIds) // Pass the order IDs as needed
      .subscribe(
        (blob: Blob) => {
          this.downloadBlob(blob);
        },
        (error: any) => {
          console.error('Error downloading file:', error);
        }
      );
  }

  downloadBlob(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = 'Fixed_Payment_Issue.xlsx'; // Set the filename
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  AddPaymentProblem() {
    console.log('clicked');
    this.openPopup();
  }
  @ViewChild('checkAllCheckbox') checkAllCheckbox!: MatCheckbox;

  selectAllRows(checked: boolean) {
    if (checked) {
      this.allChecked = true;
      this.selectedPaymentIds = this.dataSource.map((row: any) => row.termId);
      console.log(this.selectedPaymentIds);
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
    private router: Router
  ) {}

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
          .subscribe(
            (response: any) => {
              if (response && response.statusCode === 200) {
                this.selectedPaymentIds = [];
                console.log('Success:', response);
                this.loadOrders();
              } else {
                console.error('Error:', response);
              }
            },
            (error: any) => {
              console.error('Error add new Group:', error);
            }
          );
      } else {
        console.log('Dialog was closed without adding');
      }
    });
  }

  loadOrders(): void {
    const currentLanguage = this.translationService.getCurrentLanguage();

    this.apiService
      .getSolvedOrders(
        this.startDateFilter,
        this.endDateFilter,
        this.searchFilter,
        this.pageIndex + 1,
        this.pageSize
      )
      .subscribe(
        (response: any) => {
          this.ordersData = response.data;
          this.totalRecords = response.pagination.totalRecords;
          this.dataSource = this.ordersData;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Error loading orders:', error);
        }
      );
  }
  ngOnInit() {
    this.loadOrders();
  }

  applyFilter(event: any): void {
    this.searchFilter = event;
    console.log('ev', event);
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
