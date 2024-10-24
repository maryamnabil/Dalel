import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { PopupDeleteComponent } from 'src/app/shared/components/popup-delete/popup-delete.component';
import { FQAApiService } from 'src/app/shared/services/api/fqa.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-fqas',
  templateUrl: './fqas.component.html',
  styleUrls: ['./fqas.component.scss'],
  standalone: true,
  imports: [
    TableFiltersComponent,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    RouterLink,
    MatPaginatorModule,
    TranslateModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class FqasComponent implements OnInit {
  displayedColumns: string[] = ['id', 'question', 'answer', 'actions'];
  dataSource = new MatTableDataSource<any>();
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 10;
  pageIndex = 0;
  totalRecords: number = 0;
  startDateFilter: string = '';
  endDateFilter: string = '';
  searchText: string = '';

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private apiService: FQAApiService,
    private translationService: TranslationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;

    this.translationService.currentLanguage$.subscribe(() => this.loadFAQs());
  }

  onPageChanged(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadFAQs();
  }

  onDateRangeFilterApplied(event: { fromDate: string; toDate: string }): void {
    this.startDateFilter = event.fromDate;
    this.endDateFilter = event.toDate;
    this.loadFAQs();
  }

  // Search
  onSearchChanged(event: any): void {
    this.searchText = event;
    this.loadFAQs();
  }

  /* Load FAQs */
  loadFAQs() {
    const currentLanguage = this.translationService.getCurrentLanguage();
    this.apiService
      .getFAQs(this.startDateFilter, this.endDateFilter, this.searchText)
      .subscribe(
        (response: any) => {
          const FQA_DATA = response.data.map((faq: any) => {
            return {
              id: faq.id,
              question:
                currentLanguage === 'en' ? faq.question : faq.questionAr,
              answer: currentLanguage === 'en' ? faq.answer : faq.answerAr,
              createdOn: faq.createdOn,
              updatedOn: faq.updatedOn,
              createdBy: faq.createdBy,
              updatedBy: faq.updatedBy,
              status: faq.status,
            };
          });
          this.totalRecords = response.pagination?.totalRecords;
          this.dataSource = FQA_DATA;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Error loading FAQs:', error);
        }
      );
  }
  /* Delete FAQ */
  deleteFAQ(faqId: number): void {
    const dialogRef = this.dialog.open(PopupDeleteComponent, {
      width: '400px',
      data: {
        title: 'CONFIRM_DELETE',
        message: 'DELETE_FAQ_MSG',
        confirmButton: 'YES_DELETE',
        cancelButton: 'CANCEL',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.deleteFAQ(faqId).subscribe(
          () => {
            this.openSuccessPopup();
            this.loadFAQs();
          },
          (error) => {
            console.error('Error deleting FAQ:', error);
          }
        );
      }
    });
  }

  /* Success Popup */
  openSuccessPopup(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '300px',
      data: {
        message: 'DELETED',
        button: 'CLOSE',
      },
    });
  }
}
