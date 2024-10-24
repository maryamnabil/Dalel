import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { MatDialog } from '@angular/material/dialog';
import { InboxApiService } from 'src/app/shared/services/api/inbox.service';
import { InboxDetailsComponent } from '../inbox-details/inbox-details.component';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-inbox-list',
  templateUrl: './inbox-list.component.html',
  styleUrls: ['./inbox-list.component.scss'],
  standalone: true,
  imports: [
    TableFiltersComponent,
    MatTableModule,
    DatePipe,
    MatPaginatorModule,
    TranslateModule,
  ],
})
export class InboxListComponent implements OnInit {
  displayedColumns: string[] = [
    'ID',
    'Title',
    'UsersNames',
    'SendOn',
    'Actions',
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
    private apiService: InboxApiService,
    private translationService: TranslationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.translationService.currentLanguage$.subscribe(() =>
      this.loadMessages()
    );
  }

  onPageChanged(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadMessages();
  }

  onDateRangeFilterApplied(event: { fromDate: string; toDate: string }): void {
    this.startDateFilter = event.fromDate;
    this.endDateFilter = event.toDate;
    this.loadMessages();
  }

  loadMessages() {
    const currentLanguage = this.translationService.getCurrentLanguage();
    this.apiService
      .getAllMessages(
        this.startDateFilter,
        this.endDateFilter,
        this.searchFilter,
        this.pageIndex + 1,
        this.pageSize
      )
      .subscribe(
        (response: any) => {
          const messagesData = response.data.map((message: any) => ({
            id: message.id,
            title: message.title,
            sendOn: message.sendOn,
            sendToAllUsers: message.sendToAllUsers,
            usersNames: message.usersNames.join(', '),
          }));

          this.totalRecords = response.pagination.totalRecords;
          this.dataSource = messagesData;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Error loading messages', error);
        }
      );
  }

  onSearchChanged(event: string): void {
    this.searchFilter = event;
    this.loadMessages();
  }

  viewDetails(messageId: string): void {
    this.apiService.getMessageById(messageId).subscribe(
      (response: any) => {
        const message = response.data;
        console.log(response);

        const dialogRef = this.dialog.open(InboxDetailsComponent, {
          // Adjust based on your component name
          width: '1000px',
          data: {
            Message: message,
            title: 'Message_Details',
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.loadMessages();
        });
      },
      (error) => {
        console.error('Error fetching message details:', error);
        // Handle error as needed
      }
    );
  }
}
