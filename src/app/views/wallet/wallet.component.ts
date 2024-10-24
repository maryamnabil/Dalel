import { Component, DestroyRef, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  TableComponent,
  TableConfigItem,
} from 'src/app/shared/components/table/table.component';
import { NgTemplateOutlet } from '@angular/common';
import { TableFiltersComponent } from 'src/app/shared/components/table-filters/table-filters.component';
import { TitleStatusCardComponent } from 'src/app/shared/components/title-status-card/title-status-card.component';
import { WalletService } from 'src/app/shared/services/api/wallet.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    TableFiltersComponent,
    TranslateModule,
    TableComponent,
    TitleStatusCardComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  tableConfig: TableConfigItem[] = [
    {
      column: 'USER_ID',
      value: (data) => data?.userId,
    },
    {
      column: 'FULL_NAME',
      value: (data) => data?.userName,
    },
    {
      column: 'TOTAL_REFUNDS',
      value: (data) => data?.balance + ' ' + this.translate.instant('SR'),
    },
    {
      column: 'RECHARGE_REASON',
      value: (data) => data?.lastTransaction?.description,
    },
    {
      column: 'LAST_REFUND_DATE',
      value: (data) => data?.lastTransaction?.date,
      type: 'date',
    },
    {
      column: 'CURRENT_AMOUNT',
      value: (data) => data?.balance + ' ' + this.translate.instant('SR'),
    },
  ];

  responseData: any;
  counterData: any;
  pageSize = 10;
  pageIndex = 0;
  searchFilter = '';

  constructor(
    private apiService: WalletService,
    private translate: TranslateService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadCounter();
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

  loadData() {
    this.apiService
      .getWallets(this.searchFilter, this.pageIndex + 1, this.pageSize)
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

  loadCounter() {
    this.apiService
      .getCounters()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (response: any) => {
          this.counterData = response?.data;
        },
        (error) => {
          console.error('Error loading City', error);
        }
      );
  }
}
