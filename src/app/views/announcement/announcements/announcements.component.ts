import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { MatDialog } from '@angular/material/dialog';
import { AnnouncementApiService } from 'src/app/shared/services/api/announcement.service';
import { AnnouncementDetailComponent } from '../announcement-detail/announcement-detail.component';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
  standalone: true,
  imports: [
    TableFiltersComponent,
    MatTableModule,
    TranslateModule,
    MatPaginatorModule,
  ],
})
export class AnnouncementsComponent implements OnInit {
  displayedColumns: string[] = [
    'ID',
    'Subject',
    'UsersNames',
    'SendOn',
    'actions',
  ];
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
    private apiService: AnnouncementApiService,
    private translationService: TranslationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.translationService.currentLanguage$.subscribe(() =>
      this.loadAnnouncements()
    );
  }

  onPageChanged(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadAnnouncements();
  }

  onDateRangeFilterApplied(event: { fromDate: string; toDate: string }): void {
    this.startDateFilter = event.fromDate;
    this.endDateFilter = event.toDate;
    this.loadAnnouncements();
  }

  loadAnnouncements() {
    const currentLanguage = this.translationService.getCurrentLanguage();
    this.apiService
      .getAllAnnouncements(
        this.startDateFilter,
        this.endDateFilter,
        this.searchFilter,
        this.pageIndex + 1,
        this.pageSize
      )
      .subscribe(
        (response: any) => {
          const ANNOUNCEMENTS_DATA = response.data.map((announcement: any) => ({
            ID: announcement.id,
            Subject: announcement.subject,
            SendOn: announcement.sendOn,
            SendToAllUsers: announcement.sendToAllUsers,
            UsersNames: announcement.usersNames.join(', '),
          }));

          this.totalRecords = response.pagination.totalRecords;
          this.dataSource = ANNOUNCEMENTS_DATA;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Error loading announcements', error);
        }
      );
  }

  onSearchChanged(event: string): void {
    this.searchFilter = event;
    this.loadAnnouncements();
  }
  viewDetails(AnnoucId: string): void {
    this.apiService.getAnnouncementById(AnnoucId).subscribe(
      (response: any) => {
        const Announcement = response.data;

        const dialogRef = this.dialog.open(AnnouncementDetailComponent, {
          width: '1000px',
          data: {
            Announcement: Announcement,
            title: 'Announcement_Details',
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.loadAnnouncements();
        });
      },
      (error) => {
        console.error('Error fetching Announcement details:', error);
        // Handle error as needed
      }
    );
  }
}
