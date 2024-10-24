import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TranslationService } from 'src/app/shared/services/translation.service';

import { MatDialog } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { PopupConfirmComponent } from 'src/app/shared/components/popup-confirm/popup-confirm.component';
import { ManualApiService } from 'src/app/shared/services/api/manual.service';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manuals',
  templateUrl: './manuals.component.html',
  styleUrls: ['./manuals.component.scss'],
  standalone: true,
  imports: [
    TableFiltersComponent,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule,
    RouterLink,
    MatPaginatorModule,
  ],
})
export class ManualsComponent {
  displayedColumns: string[] = ['ID', 'TitleEN', 'TitleAR', 'URL', 'actions'];
  dataSource: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 10;
  pageIndex = 0;
  startDateFilter = '';
  endDateFilter = '';
  searchFilter = '';
  totalRecords: number = 0;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private apiService: ManualApiService,
    private translationService: TranslationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.translationService.currentLanguage$.subscribe(() =>
      this.loadmanuals()
    );
  }

  onPageChanged(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadmanuals();
  }
  // Date Filter
  onDateRangeFilterApplied(event: { fromDate: string; toDate: string }): void {
    this.startDateFilter = event.fromDate;
    this.endDateFilter = event.toDate;
    this.loadmanuals();
  }
  /* List manuals */
  loadmanuals() {
    // console.log('Data in component:', response.data);
    const currentLanguage = this.translationService.getCurrentLanguage();
    this.apiService
      .getManuals(
        this.startDateFilter,
        this.endDateFilter,
        this.searchFilter,
        this.pageIndex + 1,
        this.pageSize
      )
      .subscribe(
        (response: any) => {
          const MANUALS_DATA = response.data.map((manual: any) => ({
            ID: manual.id,
            URL: manual.url,
            TitleEN: manual.name,
            TitleAR: manual.nameAr,
          }));

          this.totalRecords = response.pagination.totalRecords;
          console.log(response);
          this.dataSource = MANUALS_DATA;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Error loading manuals', error);
        }
      );
  }
  onSearchChanged(event: string): void {
    this.searchFilter = event;
    this.loadmanuals();
  }
  /* Delete manual */
  deletemanual(manualId: number): void {
    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      width: '400px',
      data: {
        title: 'CONFIRM_DELETE',
        message: 'Manual_DELETE_MSG',
        confirmButton: 'YES_DELETE',
        cancelButton: 'CANCEL',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.deleteManual(manualId).subscribe(
          () => {
            this.openPopup();
            this.loadmanuals();
          },
          (error) => {
            console.error('Error deleting manual:', error);
          }
        );
      }
    });
  }

  // Success Popup
  openPopup(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '300px',
      data: {
        message: 'DELETED',
        button: 'CLOSE',
      },
    });
  }
}
