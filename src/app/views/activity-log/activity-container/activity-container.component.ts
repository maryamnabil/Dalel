import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivityLogApiService } from 'src/app/shared/services/api/activity-log.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatSortModule } from '@angular/material/sort';
import { TableFiltersComponent } from '../../../shared/components/table-filters/table-filters.component';

@Component({
  selector: 'app-activity-container',
  templateUrl: './activity-container.component.html',
  styleUrls: ['./activity-container.component.scss'],
  standalone: true,
  imports: [
    TableFiltersComponent,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    TranslateModule,
    MatDialogModule,
  ],
})
export class ActivityContainerComponent implements OnInit {
  displayedColumns: string[] = [
    'creationDate',
    'adminName',
    'creationTime',
    'activityTitle',
  ];
  dataSource = new MatTableDataSource();
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 10;
  pageIndex = 0;
  serchText = '';
  userId = '';
  totalRecords: number = 0;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private translationService: TranslationService,
    private dialog: MatDialog,
    private apiService: ActivityLogApiService
  ) {}

  ngOnInit() {
    this.translationService.currentLanguage$.subscribe(() => this.loadData());
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.serchText = filterValue.trim().toLowerCase();
    this.loadData();
  }

  onPageChanged(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadData();
  }

  loadData(): void {
    const currentLanguage = this.translationService.getCurrentLanguage();

    this.apiService
      .getLogs(this.serchText, this.userId, this.pageIndex + 1, this.pageSize)
      .subscribe(
        (response: any) => {
          const mappedData = response.data.map((item: any) => ({
            creationDate: item.createdOn,
            adminName: item.user.name,
            creationTime: new Date(item.createdOn).toLocaleTimeString(),
            activityTitle: item.actionName,
          }));
          this.totalRecords = response.pagination.totalRecords;

          this.dataSource = mappedData;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Error loading activity logs:', error);
        }
      );
  }
}
