import { formatDate } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-date-filter',
    templateUrl: './date-filter.component.html',
    styleUrls: ['./date-filter.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, MatDatepickerModule, TranslateModule]
})
export class DateFilterComponent {
  // Date Picker
  startDate: Date | null = null;
  endDate: Date | null = null;

  @Output() dateRangeChanged: EventEmitter<{ startDate:string, endDate: string }> = new EventEmitter();
  startDateFilter: any;
  endDateFilter: any;

  onDateChanged(): void {
    const dateFormat = 'MM/dd/yyyy';

    this.startDateFilter = this.startDate? formatDate(this.startDate ,dateFormat, 'en-US') : '';
    this.endDateFilter = this.endDate ? formatDate(this.endDate, dateFormat, 'en-US') : '';
    this.dateRangeChanged.emit({ startDate: this.startDateFilter, endDate: this.endDateFilter });
    console.log(this.startDateFilter, this.endDateFilter)
  }
}
