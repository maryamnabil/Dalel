import { Component, OnInit } from '@angular/core';
import { MarketingReportsService } from 'src/app/shared/services/api/marketing-reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { ChartsComponent } from '../../../shared/components/charts/charts.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-main-reports',
  templateUrl: './main-reports.component.html',
  styleUrls: ['./main-reports.component.scss'],
  standalone: true,
  imports: [
    ChartsComponent,
    TranslateModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class MainReportsComponent implements OnInit {
  newRegisteredChart: any;
  newRegisteredDateFrom = '';
  newRegisteredDateTo = '';

  registeredWithLocationChart: any;
  registeredWithLocationDateFrom = '';
  registeredWithLocationDateTo = '';

  registeredWithCategoryChart: any;
  registeredWithCategoryDateFrom = '';
  registeredWithCategoryDateTo = '';

  projectByCategoryChart: any;
  projectByCategoryDateFrom = '';
  projectByCategoryDateTo = '';

  constructor(private apiService: MarketingReportsService) {}

  ngOnInit(): void {
    this.getNewRegisteredChart();
    this.getRegisteredWithLocationChart();
    this.getRegisteredWithCategoryChart();
    this.getProjectByCategoryChart();
  }

  getNewRegisteredChart() {
    this.apiService
      .getNewRegisteredChart(
        this.newRegisteredDateFrom,
        this.newRegisteredDateTo
      )
      .subscribe((response: any) => {
        this.newRegisteredChart = response?.data;
      });
  }

  getRegisteredWithLocationChart() {
    this.apiService
      .getRegisterUserWithLocationChart(
        this.newRegisteredDateFrom,
        this.newRegisteredDateTo
      )
      .subscribe((response: any) => {
        this.registeredWithLocationChart = response?.data;
      });
  }

  getRegisteredWithCategoryChart() {
    this.apiService
      .getRegisterUserWithCategoryChart(
        this.registeredWithCategoryDateFrom,
        this.registeredWithCategoryDateTo
      )
      .subscribe((response: any) => {
        this.registeredWithCategoryChart = response?.data;
      });
  }

  getProjectByCategoryChart() {
    this.apiService
      .getProjectByCategoryChart(
        this.projectByCategoryDateFrom,
        this.projectByCategoryDateTo
      )
      .subscribe((response: any) => {
        this.projectByCategoryChart = response?.data;
      });
  }

  newRegisteredDateChanged(event: any) {
    this.newRegisteredDateFrom = event.startDate;
    this.newRegisteredDateTo = event.endDate;
    this.getNewRegisteredChart();
  }

  registeredWithLocationDateChanged(event: any) {
    this.newRegisteredDateFrom = event.startDate;
    this.newRegisteredDateTo = event.endDate;
    this.getRegisteredWithLocationChart();
  }

  registeredWithCategoryDateChanged(event: any) {
    this.registeredWithCategoryDateFrom = event.startDate;
    this.registeredWithCategoryDateTo = event.endDate;
    this.getRegisteredWithCategoryChart();
  }

  projectByCategoryDateChanged(event: any) {
    this.projectByCategoryDateFrom = event.startDate;
    this.projectByCategoryDateTo = event.endDate;
    this.getProjectByCategoryChart();
  }
}
