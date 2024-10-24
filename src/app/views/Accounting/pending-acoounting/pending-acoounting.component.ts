import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { AccountingPopUpComponent } from '../accounting-pop-up/accounting-pop-up.component';
import { OrdersGroupService } from 'src/app/shared/services/orders-group.service';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-pending-acoounting',
  templateUrl: './pending-acoounting.component.html',
  styleUrls: ['./pending-acoounting.component.scss'],
  standalone: true,
  imports: [
    TableFiltersComponent,
    MatTableModule,
    TranslateModule,
    RouterLink,
    NgClass,
    MatPaginatorModule,
  ],
})
export class PendingAcoountingComponent implements OnInit {
  displayedColumns: string[] = [
    'FileId',
    'FileName',
    'numberOfOrders',
    'createdOn',
    'fromDate',
    'toDate',
    'price',
    'commission',
    'status',
    'actions',
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
  selectedOrderIds: string[] = [];
  ordersData: any[] = [];
  groupName: string = '';

  onAddGroup() {
    console.log('clicked');
    this.openPopup();
  }
  @ViewChild('checkAllCheckbox') checkAllCheckbox!: MatCheckbox;

  selectAllRows(checked: boolean) {
    if (checked) {
      this.allChecked = true;
      console;
      this.selectedOrderIds = this.ordersData.map((row: any) => row.orderId);
      console.log(this.selectedOrderIds);
    } else {
      this.allChecked = false;
      this.selectedOrderIds = [];
    }
  }

  selectRow(
    event: MatCheckboxChange,
    orderId: string,
    checkAllChecked: boolean
  ) {
    if (checkAllChecked) {
      if (event.checked) {
        this.selectedOrderIds.push(orderId);
      } else {
        const index = this.selectedOrderIds.indexOf(orderId);
        if (index !== -1) {
          this.selectedOrderIds.splice(index, 1);
        }
      }
    } else {
      if (event.checked) {
        this.selectedOrderIds.push(orderId);
      } else {
        const index = this.selectedOrderIds.indexOf(orderId);
        if (index !== -1) {
          this.selectedOrderIds.splice(index, 1);
        }
      }
    }
  }

  constructor(
    private apiService: OrdersGroupService,
    private translationService: TranslationService,
    private dialog: MatDialog
  ) {}

  openPopup(): void {
    const dialogRef = this.dialog.open(AccountingPopUpComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.addGroup(result, this.selectedOrderIds).subscribe(
          (response: any) => {
            if (response && response.statusCode === 200) {
              console.log('Success:', response);
              this.selectedOrderIds = [];
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

  encodeFileName(fileName: string): string {
    return encodeURIComponent(fileName);
  }

  loadOrders(): void {
    const currentLanguage = this.translationService.getCurrentLanguage();

    this.apiService
      .getGroups(
        this.pageIndex + 1,
        this.pageSize,
        this.startDateFilter,
        this.endDateFilter,
        this.searchFilter,
        '',
        ''
      )
      .subscribe(
        (response: any) => {
          console.log('Loadorder', response);
          this.ordersData = response.data.map((file: any) => ({
            FileId: file.id,
            FileName: file.name,
            numberOfOrders: file.numberOfOrders,
            createdOn: file.createdOn,
            fromDate: file.fromDate,
            toDate: file.toDate,
            price: file.price,
            commission: file.commission,
            paymentStatus: file.isPaied ? 'Paid' : 'Not Paid',
          }));
          console.log(this.ordersData);

          this.totalRecords = response.pagination?.totalRecords;
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
