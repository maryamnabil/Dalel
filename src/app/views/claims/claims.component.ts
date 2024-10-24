import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { MatDialog } from '@angular/material/dialog';
import { ClaimApiService } from 'src/app/shared/services/api/claim.service';
import { ClaimViewDetailsPopupComponent } from './claim-view-details-popup/claim-view-details-popup.component';
import { TableFiltersComponent } from '../../shared/components/table-filters/table-filters.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss'],
  standalone: true,
  imports: [
    TableFiltersComponent,
    MatTableModule,
    TranslateModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
  ],
})
export class ClaimsComponent implements OnInit {
  displayedColumns: string[] = [
    'User',
    'Message',
    'Subject',
    'Status',
    'MessageDate',
    'actions',
  ];
  dataSource = new MatTableDataSource();
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 10;
  pageIndex = 0;
  startDateFilter = '';
  endDateFilter = '';
  searchFilter = '';
  isClosed: boolean | null = null;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  totalRecords: number = 0;

  constructor(
    private apiService: ClaimApiService,
    private translationService: TranslationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.loadClaim();

    this.translationService.currentLanguage$.subscribe(() => this.loadClaim());
  }

  onPageChanged(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadClaim();
  }

  /* List Claim */
  loadClaim() {
    // console.log('Data in component:', response.data);
    const currentLanguage = this.translationService.getCurrentLanguage();
    this.apiService
      .getClaims(
        this.startDateFilter,
        this.endDateFilter,
        this.searchFilter,
        this.pageIndex + 1,
        this.pageSize,
        this.isClosed
      )
      .subscribe(
        (response: any) => {
          console.log(response);

          const Claim_DATA = response.data.map((Claim: any) => ({
            ClaimId: Claim.id,
            User: Claim.user.name,
            Message: Claim.message,
            Subject: Claim.Subject
              ? currentLanguage === 'en'
                ? Claim.Subject.name
                : Claim.Subject.nameAr
              : '',
            Status: Claim.isClosed,
            MessageDate: Claim.createdOn,
          }));
          console.log(Claim_DATA);
          this.dataSource = Claim_DATA;
          this.dataSource.paginator = this.paginator;
          this.totalRecords = response.pagination.totalRecords;
        },
        (error) => {
          console.error('Error loading Claim', error);
        }
      );
  }

  onStatusChange(event: any): void {
    if (event === '') {
      this.isClosed = null;
    } else if (event == 1) {
      this.isClosed = true;
    } else if (event == 0) {
      this.isClosed = false;
    }
    this.loadClaim();
  }
  // Search
  onSearchChanged(event: string): void {
    this.searchFilter = event;
    this.loadClaim();
  }

  // Date Filter
  onDateRangeFilterApplied(event: { fromDate: string; toDate: string }): void {
    this.startDateFilter = event.fromDate;
    this.endDateFilter = event.toDate;
    this.loadClaim();
  }

  ViewDetails(ClaimId: number): void {
    this.apiService.getClaimById(ClaimId).subscribe(
      (response: any) => {
        const claim = response.data;
        console.log(claim);

        const dialogRef = this.dialog.open(ClaimViewDetailsPopupComponent, {
          width: '1000px',
          data: {
            claim: claim,
            title: 'CLAIM_DETAILS',
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.loadClaim();
        });
      },
      (error) => {
        console.error('Error fetching claim details:', error);
        // Handle error as needed
      }
    );
  }
}
