import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    TranslateModule,
  ],
})
export class DateRangeFilterComponent {
  // Date Picker
  startDate: Date | null = null;
  endDate: Date | null = null;

  @Output() dateRangeChanged: EventEmitter<{
    fromDate: string;
    toDate: string;
  }> = new EventEmitter();

  onDateChanged(): void {
    this.dateRangeChanged.emit({
      fromDate: this.formatDate(this.startDate),
      toDate: this.formatDate(this.endDate),
    });
  }

  formatDate(date: Date | null): string {
    if (!date) return '';

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }
}
