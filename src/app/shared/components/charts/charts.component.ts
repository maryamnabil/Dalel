import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
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
import { DateFilterComponent } from '../date-filter/date-filter.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  standalone: true,
  imports: [DateFilterComponent],
})
export class ChartsComponent implements OnDestroy {
  startDateFilter = '';
  endDateFilter = '';
  chartData: { labels: string[]; series: number[] } = {
    labels: [],
    series: [],
  };
  chart!: Chart;

  @Input() title: string;
  @Input() id: string;

  @Output() dataChangeEvent = new EventEmitter();

  @Input() set data(data: any) {
    if (data) {
      this.chartData.labels = data.labels;
      this.chartData.series = data.series;
      setTimeout(() => {
        this.createChart();
      }, 0);
    }
  }

  constructor(private _translate: TranslateService) {}

  onDateRangeFilterApplied(event: { fromDate: string; toDate: string }): void {
    this.startDateFilter = event.fromDate;
    this.endDateFilter = event.toDate;
    this.dataChangeEvent.emit({
      startDate: this.startDateFilter,
      endDate: this.endDateFilter,
    });
    this.chart.destroy();
  }

  createChart() {
    const ctx = document.getElementById(this.id) as HTMLCanvasElement;

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
            backgroundColor: '#7B008F',
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 0,
            barThickness: 111,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        aspectRatio: 1,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 250,
              color: 'white',
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawTicks: false,
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

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
