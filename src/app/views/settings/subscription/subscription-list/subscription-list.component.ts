import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { PopupConfirmComponent } from 'src/app/shared/components/popup-confirm/popup-confirm.component';
import { SubscriptionApiService } from 'src/app/shared/services/api/subscription.service';
import { TableFiltersComponent } from '../../../../shared/components/table-filters/table-filters.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-subscription-subject-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss'],
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
export class SubscriptionListComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'NameAr', 'Price', 'ValidDays', 'actions'];
  dataSource = new MatTableDataSource();
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 10;
  Id: number =1
  pageIndex = 0;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private apiService: SubscriptionApiService,
    private translationService: TranslationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;

    // Reload data when language changes
    this.translationService.currentLanguage$.subscribe(() => this.getSubscription());
  }

  // Handle pagination change event
  onPageChanged(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getSubscription();
  }

  // Fetch the subscription list
  getSubscription() {

    const currentLanguage = this.translationService.getCurrentLanguage();
  
    this.apiService.GetSubscriptionById(this.Id).subscribe(
      (response: any) => {
        
        const subscription = {
          name: response.data.name,         
          nameAr: response.data.nameAr,      
          price: response.data.price,        
          numberOfValidDays: response.data.numberOfValidDays,  
        };
  
        
        this.dataSource.data = [subscription]; 
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Error loading subscription', error);
      }
    );
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
