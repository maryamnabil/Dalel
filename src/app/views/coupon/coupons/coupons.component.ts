import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { PopupDeleteComponent } from 'src/app/shared/components/popup-delete/popup-delete.component';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { CouponApiService } from 'src/app/shared/services/api/coupon.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgClass } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import { GetPromosUseageCountComponent } from '../get-promos-useage-count/get-promos-useage-count.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss'],
  standalone: true,
  imports: [
    GetPromosUseageCountComponent,
    TableFiltersComponent,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatMenuModule,
    MatIconModule,
    RouterLink,
    MatPaginatorModule,
    TranslateModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class CouponsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'promoCode',
    'validFrom',
    'validTo',
    'discountPercentage',
    'isActive',
    'actions',
  ];

  dataSource: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 10;
  pageIndex = 0;
  searchText: string = '';
  startDateFilter = '';
  endDateFilter = '';
  totalRecords: number = 0;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private couponApiService: CouponApiService,
    private translationService: TranslationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.translationService.currentLanguage$.subscribe(() =>
      this.loadCoupons()
    );
  }

  onPageChanged(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadCoupons();
  }

  loadCoupons() {
    const currentLanguage = this.translationService.getCurrentLanguage();
    this.couponApiService
      .getPromos(
        this.searchText,
        this.startDateFilter,
        this.endDateFilter,
        this.pageIndex + 1,
        this.pageSize
      )
      .subscribe(
        (response: any) => {
          const COUPONS_DATA = response.data.map((coupon: any) => ({
            id: coupon.id,
            promoCode: coupon.promoCode,
            validFrom: coupon.validFrom,
            validTo: coupon.validTo,
            discountPercentage: coupon.discountPrecentage,
            isActive: coupon.isActive,
          }));
          this.totalRecords = response.pagination.totalRecords;

          this.dataSource = COUPONS_DATA;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Error loading coupons ', error);
        }
      );
  }

  onSearchChanged(event: string): void {
    this.searchText = event;
    this.loadCoupons();
  }

  onDateRangeFilterApplied(event: { fromDate: string; toDate: string }): void {
    this.startDateFilter = event.fromDate;
    this.endDateFilter = event.toDate;
    this.loadCoupons();
  }

  deleteCoupon(couponId: string): void {
    const dialogRef = this.dialog.open(PopupDeleteComponent, {
      width: '400px',
      data: {
        title: 'CONFIRM_DELETE',
        message: 'COUPON_DELETE_MSG',
        confirmButton: 'YES_DELETE',
        cancelButton: 'CANCEL',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.couponApiService.deletePromo(couponId).subscribe(
          () => {
            this.openPopup();
            this.loadCoupons();
          },
          (error) => {
            console.error('Error deleting coupon:', error);
          }
        );
      }
    });
  }
  ChangeStatus(couponId: string): void {
    this.couponApiService.changeStatus(couponId).subscribe(
      () => {
        this.openSucess();
        this.loadCoupons();
      },
      (error) => {
        console.error('Error deleting coupon:', error);
      }
    );
  }

  openSucess(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '300px',
      data: {
        message: 'CHANGED',
        button: 'CLOSE',
      },
    });
  }
  openPopup(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '300px',
      data: {
        message: 'DELETED',
        button: 'CLOSE',
      },
    });
  }
}
