import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { PopupConfirmComponent } from 'src/app/shared/components/popup-confirm/popup-confirm.component';
import { ClamSubjectApiService } from 'src/app/shared/services/api/clam-subject.service';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-clam-subject-list',
  templateUrl: './clam-subject-list.component.html',
  styleUrls: ['./clam-subject-list.component.scss'],
  standalone: true,
  imports: [
    TableFiltersComponent,
    MatTableModule,
    TranslateModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
    MatPaginatorModule,
  ],
})
export class ClamSubjectListComponent implements OnInit {
  displayedColumns: string[] = [
    'ClamSubjectId',
    'ClamSubjectNameEN',
    'ClamSubjectNameAR',
    'actions',
  ];
  dataSource = new MatTableDataSource();
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 10;
  pageIndex = 0;
  totalRecords: number = 0;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private apiService: ClamSubjectApiService,
    private translationService: TranslationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;

    this.translationService.currentLanguage$.subscribe(() =>
      this.loadClamSubjects()
    );
  }

  onPageChanged(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadClamSubjects();
  }

  /* List ClamSubjects */
  loadClamSubjects() {
    // console.log('Data in component:', response.data);
    const currentLanguage = this.translationService.getCurrentLanguage();
    this.apiService.getClamSubjects().subscribe(
      (response: any) => {
        const ClamSubjectS_DATA = response.data.map((ClamSubject: any) => ({
          ClamSubjectId: ClamSubject.id,
          ClamSubjectNameEN: ClamSubject.name,
          ClamSubjectNameAR: ClamSubject.nameAr,
        }));
        // this.totalRecords =response.pagination.totalRecords;

        this.dataSource.data = ClamSubjectS_DATA;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Error loading ClaimSubjects', error);
      }
    );
  }

  /* Delete ClamSubject */
  deleteClamSubject(ClamSubjectId: number): void {
    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      width: '400px',
      data: {
        title: 'CONFIRM_DELETE',
        message: 'CLAIM_DELETE_MSG',
        confirmButton: 'YES_DELETE',
        cancelButton: 'CANCEL',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.deleteClamSubject(ClamSubjectId).subscribe(
          () => {
            this.openPopup();
            this.loadClamSubjects();
          },
          (error) => {
            console.error('Error deleting ClamSubject:', error);
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
