import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TaxesApiService } from 'src/app/shared/services/api/taxes.service';

@Component({
  selector: 'app-taxes-list',
  templateUrl: './taxes-list.component.html',
  styleUrls: ['./taxes-list.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    TranslateModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
  ],
})
export class TaxesListComponent {
  displayedColumns: string[] = ['vatRate', 'actions'];
  dataSource = new MatTableDataSource<VatData>();

  constructor(private apiService: TaxesApiService) {}

  ngOnInit() {
    this.loadTaxes();
  }

  loadTaxes() {
    this.apiService.getTaxes().subscribe(
      (response: any) => {
        const vatRate = response.data.result;
        const VAT_DATA: VatData[] = [{ vatRate }];
        this.dataSource.data = VAT_DATA;
      },
      (error) => {
        console.error('Error loading taxes', error);
      }
    );
  }
}

export interface VatData {
  vatRate: number;
}
