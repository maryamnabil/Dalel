import { formatDate, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-table-filters',
  templateUrl: './table-filters.component.html',
  styleUrls: ['./table-filters.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    RouterLink,
    TranslateModule,
    MatNativeDateModule,
  ],
})
export class TableFiltersComponent {
  @Input() pageTitle = '';
  @Input() showAdditionalButton = true;
  @Input() showExportBtn = false;
  @Input() buttonText = '';
  @Input() buttonLink = '';
  @Input() showSecondButton = false;
  @Input() secondButtonText = '';
  @Input() secondButtonLink = '';
  @Input() showSubTitle = false;
  @Input() subTitle = '';
  @Input() showDropDown = false;
  @Input() showDropDownAuthority = false;
  @Input() showIsClosed = false;
  @Input() showDateFilter = true;
  @Input() showSearchFiltre = true;
  @Input() showAddGroupButton = false;
  @Input() AccountingButtonText = '';
  @Input() showExportToBank = false;
  @Input() ExportToBankText = '';
  @Input() showAccountingDropDown = false;

  // Search
  @Output() SearchChanged: EventEmitter<string> = new EventEmitter();
  startDateFilter: any;
  endDateFilter: any;
  @Output() AddGroupClicked: EventEmitter<void> = new EventEmitter();
  @Output() ExportToBankClicked: EventEmitter<void> = new EventEmitter();
  @Output() SelectAccountStatus: EventEmitter<any> = new EventEmitter();

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.SearchChanged.emit(filterValue);
  }

  // Date Picker
  startDate: Date | null = null;
  endDate: Date | null = null;

  @Output() dateRangeChanged: EventEmitter<{
    startDate: string;
    endDate: string;
  }> = new EventEmitter();
  @Output() ChangeStatus: EventEmitter<any> = new EventEmitter();

  onDateChanged(): void {
    const dateFormat = 'MM/dd/yyyy';

    this.startDateFilter = this.startDate
      ? formatDate(this.startDate, dateFormat, 'en-US')
      : '';
    this.endDateFilter = this.endDate
      ? formatDate(this.endDate, dateFormat, 'en-US')
      : '';
    this.dateRangeChanged.emit({
      startDate: this.startDateFilter,
      endDate: this.endDateFilter,
    });
  }

  OnStausChange(event: any) {
    const selectedValue = event.target.value;
    console.log(selectedValue);
    this.ChangeStatus.emit(selectedValue);
  }

  AddGroup() {
    this.AddGroupClicked.emit();
  }

  OnExportToBank() {
    this.ExportToBankClicked.emit();
  }

  onSelectAccountStatus(event: any) {
    const selectedValue = event.target.value;
    this.SelectAccountStatus.emit(selectedValue);
  }
}
