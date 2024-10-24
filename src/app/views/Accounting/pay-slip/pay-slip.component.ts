import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TranslationService } from 'src/app/shared/services/translation.service';
import {
  MatCheckbox,
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { AccountingPopUpComponent } from '../accounting-pop-up/accounting-pop-up.component';
import { OrdersGroupService } from 'src/app/shared/services/orders-group.service';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
  selector: 'app-pay-slip',
  templateUrl: './pay-slip.component.html',
  styleUrls: ['./pay-slip.component.scss'],
  standalone: true,
  imports: [
    TableFiltersComponent,
    MatTableModule,
    TranslateModule,
    MatCheckboxModule,
    MatPaginatorModule,
    NgClass,
    RouterLink,
    DatePipe,
  ],
})
export class PaySlipComponent implements OnInit {
  displayedColumns: string[] = [
    'selectAll',
    'companyName',
    'vendorName',
    'projectName',
    'paymentId',
    'paymentDate',
    'amount',
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
  onAddGroup() {
    if (!this.selectedPaymentIds.length) {
      return;
    }
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
    paymentId: string,
    checkAllChecked: boolean
  ) {
    if (checkAllChecked) {
      if (event.checked) {
        this.selectedPaymentIds.push(paymentId);
      } else {
        const index = this.selectedPaymentIds.indexOf(paymentId);
        if (index !== -1) {
          this.selectedPaymentIds.splice(index, 1);
        }
      }
    } else {
      if (event.checked) {
        this.selectedPaymentIds.push(paymentId);
      } else {
        const index = this.selectedPaymentIds.indexOf(paymentId);
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
    private helperService: HelperService
  ) {}

  openPopup(): void {
    const dialogRef = this.dialog.open(AccountingPopUpComponent, {
      width: '400px',
      data: {
        title: 'ADD_GROUP',
        message: 'GROUP_NAME',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService
          .addGroup(result, this.selectedPaymentIds)
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
      .getOrders(
        this.pageIndex + 1,
        this.pageSize,
        this.startDateFilter,
        this.endDateFilter,
        this.searchFilter
      )
      .subscribe((response: any) => {
        this.ordersData = response.data;
        this.totalRecords = response.pagination.totalRecords;
        this.dataSource = this.ordersData;
        this.dataSource.paginator = this.paginator;
      });
  }
  ngOnInit() {
    this.loadOrders();
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
