import { Component, ViewChild, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { CouponApiService } from 'src/app/shared/services/api/coupon.service';
import { Chart } from 'chart.js';
import { DateFilterComponent } from '../../../shared/components/date-filter/date-filter.component';



@Component({
    selector: 'app-get-promos-useage-count',
    templateUrl: './get-promos-useage-count.component.html',
    styleUrls: ['./get-promos-useage-count.component.scss'],
    standalone: true,
    imports: [DateFilterComponent]
})
export class GetPromosUseageCountComponent  implements OnInit {
  startDateFilter = '';
  endDateFilter = '';
  chartData: { labels: string[]; series: number[] } = {
    labels: [],
    series: []
  };
  chart !:Chart

  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData = [
    { data: [], label: 'Promo Usage Count' }
  ];

  constructor(private apiService: CouponApiService) { }

  ngOnInit() {
    this.getPromosUsageCount();
  }
  onDateRangeFilterApplied(event: { fromDate: string, toDate: string}): void 
  {
    this.startDateFilter=event.fromDate;
    this.endDateFilter=event.toDate;
    this.chart.destroy(); 
    this.getPromosUsageCount();
  }
  getPromosUsageCount() {
    this.apiService.getPromosUsageCount(this.startDateFilter,this.endDateFilter).subscribe(
      (response: any) => {
        if (response) {
          
          this.chartData.labels = response.data.labels;
          this.chartData.series = response.data.series;
        
          this.createChart();
        }
      },
      error => {
        console.error('Error fetching Promo Usage Count:', error);
      }
    );
  }
  createChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
  
    if (!ctx) {
      console.error('Chart canvas element not found.');
      return;
    }
  
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.chartData.labels,
        datasets: [{
          label: '  Coupon Usages',
          data: this.chartData.series,
          backgroundColor: 'rgba(0, 0, 255, 0.2)',
          borderColor: 'rgba(0, 0, 0, 1)', 
          borderWidth: 1,
          barThickness: 30,
        }],
      },
      options: {
        maintainAspectRatio: false, 
        aspectRatio: 1, 
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 0.5, 
              color: 'white', 
              
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)', 
              drawTicks: false, 
            }
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