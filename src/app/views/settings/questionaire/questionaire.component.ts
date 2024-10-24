import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { PopupDeleteComponent } from 'src/app/shared/components/popup-delete/popup-delete.component';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { CouponApiService } from 'src/app/shared/services/api/coupon.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgClass } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { TableFiltersComponent } from 'src/app/shared/components/table-filters/table-filters.component';
import { GetPromosUseageCountComponent } from 'src/app/views/coupon/get-promos-useage-count/get-promos-useage-count.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { QuestionaireApiService } from 'src/app/shared/services/api/questionaire.service';

@Component({
  selector: 'app-questionaire',
  templateUrl: './questionaire.component.html',
  styleUrls: ['./questionaire.component.scss'],
  standalone: true,
  imports: [
    GetPromosUseageCountComponent,
    TableFiltersComponent,
    MatTableModule,
    MatSortModule,
    NgClass,
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
export class QuestionaireComponent {
  displayedColumns: string[] = ['id', 'question', 'questionAr', 'actions'];

  dataSource: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 10;
  pageIndex = 0;
  searchText: string = '';
  startDateFilter = '';
  endDateFilter = '';
  currentLang = '';
  totalRecords: number = 0;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private questionApiService: QuestionaireApiService,
    private translationService: TranslationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.currentLang = this.translationService.getCurrentLanguage();
    this.translationService.currentLanguage$.subscribe(() =>
      this.loadQuestions()
    );
  }

  onPageChanged(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadQuestions();
  }

  loadQuestions() {
    this.questionApiService
      .getQuestionaire(
        this.startDateFilter,
        this.endDateFilter,
        this.searchText
      )
      .subscribe(
        (response: any) => {
          const QUESTIONS_DATA = response.data.map((question: any) => ({
            id: question.id,
            question: question.question,
            questionAr: question.questionAr,
          }));
          this.totalRecords = response.pagination?.totalRecords;

          this.dataSource = QUESTIONS_DATA;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Error loading Questions ', error);
        }
      );
  }

  onSearchChanged(event: string): void {
    this.searchText = event;
    this.loadQuestions();
  }

  onDateRangeFilterApplied(event: { fromDate: string; toDate: string }): void {
    this.startDateFilter = event.fromDate;
    this.endDateFilter = event.toDate;
    this.loadQuestions();
  }

  deleteQuestion(questionId: number): void {
    const dialogRef = this.dialog.open(PopupDeleteComponent, {
      width: '400px',
      data: {
        title: 'CONFIRM_DELETE',
        message: 'QUESTION_DELETE_MSG',
        confirmButton: 'YES_DELETE',
        cancelButton: 'CANCEL',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.questionApiService.deleteQuestion(questionId).subscribe(
          () => {
            this.openPopup();
            this.loadQuestions();
          },
          (error) => {
            console.error('Error deleting question:', error);
          }
        );
      }
    });
  }

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
