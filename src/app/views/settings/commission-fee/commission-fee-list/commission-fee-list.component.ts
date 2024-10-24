import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommissionFeeApiService } from 'src/app/shared/services/api/commission-fee.service';

@Component({
  selector: 'app-taxes-list',
  templateUrl: './commission-fee-list.component.html',
  styleUrls: ['./commission-fee-list.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    TranslateModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
  ],
})
export class CommissionFeeComponent {
  displayedColumns: string[] = ['value', 'actions'];
  dataSource = new MatTableDataSource<any>();

  constructor(private apiService: CommissionFeeApiService) {}

  ngOnInit() {
    this.loadTaxes();
  }

  loadTaxes() {
    this.apiService.getCommissionFee().subscribe(
      (response: any) => {
        const value = response.data.result;
        const COMMISSION_DATA: any[] = [{ value }];
        this.dataSource.data = COMMISSION_DATA;
      },
      (error) => {
        console.error('Error loading taxes', error);
      }
    );
  }
}
