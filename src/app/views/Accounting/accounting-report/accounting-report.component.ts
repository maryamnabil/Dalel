import { CommonModule, formatDate } from '@angular/common';
import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { AccountingService } from 'src/app/shared/services/api/accounting.service';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { DateRangeFilterComponent } from '../../../shared/components/date-range-filter/date-range-filter.component';
import { StatBlockComponent } from '../../../shared/components/report-blocks/stat-block/stat-block.component';
import { GraphBlockComponent } from '../../../shared/components/report-blocks/graph-block/graph-block.component';
import { PaymentsByMonthsComponent } from '../payments-by-months/payments-by-months.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-accounting-report',
  templateUrl: './accounting-report.component.html',
  styleUrls: ['./accounting-report.component.scss'],
  standalone: true,
  imports: [
    DateRangeFilterComponent,
    StatBlockComponent,
    GraphBlockComponent,
    PaymentsByMonthsComponent,
    TranslateModule,
    CommonModule,
  ],
})
export class AccountingReportComponent {
  startDate: string = '';
  endDate: string = '';
  startDateFilter: string = '';
  endDateFilter: string = '';
  PAID!: string;
  TOTAL!: string;
  REMAINING_TO_PAY!: string;

  ngOnInit(): void {
    this.loadAll();
  }
  loadAll() {
    this.getToatalFess();
  }

  constructor(
    private apiService: AccountingService,
    private translationService: TranslationService
  ) {}
  onDateRangeFilterApplied(event: { fromDate: string; toDate: string }): void {
    const dateFormat = 'MM/dd/yyyy';

    this.startDate = event.fromDate;
    this.endDate = event.toDate;
    this.startDateFilter = this.startDate
      ? formatDate(this.startDate, dateFormat, 'en-US')
      : '';
    this.endDateFilter = this.endDate
      ? formatDate(this.endDate, dateFormat, 'en-US')
      : '';
    console.log(this.startDateFilter, this.endDateFilter);
    this.loadAll();
  }

  getToatalFess(): void {
    this.apiService
      .getTotalFees(this.startDateFilter, this.endDateFilter)
      .subscribe(
        (response: any) => {
          if (response) {
            console.log(response);
            this.TOTAL = response.data.totalFees;
            this.PAID = response.data.totalFees;
            this.REMAINING_TO_PAY = '0';
          }
        },
        (error) => {
          console.error('Error fetching Promo Usage Count:', error);
        }
      );
  }
}
