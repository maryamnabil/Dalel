import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  Chart,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  BarController,
  BarElement,
} from 'chart.js';
import { AccountingService } from 'src/app/shared/services/api/accounting.service';
import { TranslationService } from 'src/app/shared/services/translation.service';
@Component({
  selector: 'app-payments-by-months',
  templateUrl: './payments-by-months.component.html',
  styleUrls: ['./payments-by-months.component.scss'],
  standalone: true,
  imports: [TranslateModule, NgFor],
})
export class PaymentsByMonthsComponent implements OnInit {
  selectedYear: string = '';

  years!: number[];
  PaymentData: any[] = [];
  chartData: { labels: string[]; series: number[] } = {
    labels: [],
    series: [],
  };

  constructor(
    private apiService: AccountingService,
    private translationService: TranslationService
  ) {}
  ngOnInit(): void {
    this.chart?.destroy();
    this.selectedYear = '1999';

    this.LoadPaymentsByMonths();
    this.years = Array.from(
      { length: new Date().getFullYear() - 1999 },
      (_, index) => 2000 + index
    );
  }
  startDateFilter = '';
  endDateFilter = '';
  chart!: Chart;

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  onSelectDepartment(event: any) {
    this.selectedYear = event.target.value;
    this.LoadPaymentsByMonths();
  }

  LoadPaymentsByMonths(): void {
    const currentLanguage = this.translationService.getCurrentLanguage();

    this.apiService.PaymentsByMonths(this.selectedYear).subscribe(
      (response: any) => {
        if (response) {
          const paymentMap = new Map<number, number>();

          response.data.forEach((item: any) => {
            paymentMap.set(item.month, item.totalFees);
          });
          console.log(paymentMap);

          this.PaymentData = monthsWithId.map((monthInfo: any) => ({
            id: monthInfo.id,
            month: monthInfo.month,
            totalFees: paymentMap.has(monthInfo.month)
              ? paymentMap.get(monthInfo.month)
              : 0,
          }));

          this.chartData.labels = this.PaymentData.map((item) => item.month);
          console.log(this.chartData.labels);
          this.chartData.series = this.PaymentData.map(
            (item) => item.totalFees
          );
          console.log(this.chartData.series);

          this.createChart('PaymentChart');
        }
      },
      (error) => {
        console.error('Error fetching payments by months:', error);
      }
    );
  }

  createChart(canvasId: string) {
    this.chart?.destroy();

    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;

    if (!ctx) {
      console.error('Chart canvas element not found.');
      return;
    }

    // Register the necessary components
    Chart.register(
      BarElement,
      BarController,
      CategoryScale,
      LinearScale,
      PointElement,
      Tooltip,
      Legend
    );

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.chartData.labels,
        datasets: [
          {
            data: this.chartData.series,
            backgroundColor: '#9BD0F5',
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        aspectRatio: 2,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 50000,
              color: 'white',
            },
          },
          x: {
            beginAtZero: true,
            ticks: {
              color: 'white',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
}

const monthsWithId = [
  { id: 1, month: 'January' },
  { id: 2, month: 'February' },
  { id: 3, month: 'March' },
  { id: 4, month: 'April' },
  { id: 5, month: 'May' },
  { id: 6, month: 'June' },
  { id: 7, month: 'July' },
  { id: 8, month: 'August' },
  { id: 9, month: 'September' },
  { id: 10, month: 'October' },
  { id: 11, month: 'November' },
  { id: 12, month: 'December' },
];
