import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChartsComponent } from '../../../shared/components/charts/charts.component';
import { NgIf } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DateRangeFilterComponent } from '../../../shared/components/date-range-filter/date-range-filter.component';
import { DashboardApiService } from 'src/app/shared/services/api/dashboard.service';
import { DateFilterComponent } from '../../../shared/components/date-filter/date-filter.component';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ChartsComponent,
    TranslateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DateRangeFilterComponent,
    DateFilterComponent,
    TableFiltersComponent,
  ],
})
export class DashboardComponent implements OnInit {
  data: any;
  startDateFilter = '';
  endDateFilter = '';
  visitorsChart: any;
  visitorsDateFrom = '';
  visitorsDateTo = '';

  constructor(private apiService: DashboardApiService) {}

  ngOnInit(): void {
    this.getDashboardData();
    this.getVisitorsChart();
  }

  getDashboardData() {
    this.apiService
      .getDashboardData(this.startDateFilter, this.endDateFilter)
      .subscribe(
        (response: any) => {
          this.data = response?.data;
        },
        (error) => {
          console.error('Error loading City', error);
        }
      );
  }

  getVisitorsChart() {
    this.apiService
      .getVisitorsChart(this.visitorsDateFrom, this.visitorsDateTo)
      .subscribe(
        (response: any) => {
          this.visitorsChart = response?.data;
        },
        (error) => {
          console.error('Error loading City', error);
        }
      );
  }

  visitorsDateChanged(event: any) {
    this.visitorsDateFrom = event.startDate;
    this.visitorsDateTo = event.endDate;
    this.getVisitorsChart();
  }
  onDateRangeFilterApplied(event: any): void {
    this.startDateFilter = event.fromDate;
    this.endDateFilter = event.toDate;
    this.getDashboardData();
  }
}
