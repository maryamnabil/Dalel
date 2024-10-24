import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TranslationService } from 'src/app/shared/services/translation.service';
import {
  MatCheckbox,
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { OrdersGroupService } from 'src/app/shared/services/orders-group.service';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe, NgClass } from '@angular/common';
@Component({
  selector: 'app-payment-issues',
  templateUrl: './payment-issues.component.html',
  styleUrls: ['./payment-issues.component.scss'],
  standalone: true,
  imports: [
    TableFiltersComponent,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    TranslateModule,
    NgClass,
    DatePipe,
  ],
})
export class PaymentIssuesComponent implements OnInit {
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

  AddPaymentProblem() {
    console.log('clicked');
    this.openPopup();
  }
  @ViewChild('checkAllCheckbox') checkAllCheckbox!: MatCheckbox;

  selectAllRows(checked: boolean) {
    if (checked) {
      this.allChecked = true;
      console;
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
        console.log('selected', this.selectedPaymentIds);
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
    private route: ActivatedRoute
  ) {}

  openPopup(): void {
    this.apiService.RemoveIssueFromOrders(this.selectedPaymentIds).subscribe(
      (response: any) => {
        if (response && response.statusCode === 200) {
          console.log('Success:', response);
          this.selectedPaymentIds = [];
          this.loadOrders();
        } else {
          console.error('Error:', response);
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  loadOrders(): void {
    const currentLanguage = this.translationService.getCurrentLanguage();

    this.apiService
      .getOrdersWithProblem(
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
    console.log();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.groupId = params.get('id') || '';
      this.loadOrders();
    });
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
