import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupSuccessComponent } from 'src/app/shared/components/popup-success/popup-success.component';
import { PopupDeleteComponent } from 'src/app/shared/components/popup-delete/popup-delete.component';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { CouponApiService } from 'src/app/shared/services/api/coupon.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgClass } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { TableFiltersComponent } from 'src/app/shared/components/table-filters/table-filters.component';
import { GetPromosUseageCountComponent } from 'src/app/views/coupon/get-promos-useage-count/get-promos-useage-count.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AreaApiService } from 'src/app/shared/services/api/area.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
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
export class CitiesComponent {
  displayedColumns: string[] = [
    'id',
    'name',
    'nameAr',
    'createdOn',
    'numberDistrict',
    'status',
    'actions',
  ];

  dataSource: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 10;
  pageIndex = 0;
  searchText: string = '';
  startDateFilter = '';
  endDateFilter = '';
  totalRecords: number = 0;
  countryId = '';
  countryName = '';
  currentLang = '';
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private areaApiService: AreaApiService,
    private translationService: TranslationService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentLang = this.translationService.getCurrentLanguage();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.countryId = params.get('countryId') || '';
      this.countryName = params.get('countryName') || '';
      this.translationService.currentLanguage$.subscribe(() =>
        this.loadCities()
      );
    });
  }

  onPageChanged(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadCities();
  }

  loadCities() {
    const currentLanguage = this.translationService.getCurrentLanguage();
    this.areaApiService
      .getCity(
        this.countryId,
        this.startDateFilter,
        this.endDateFilter,
        this.searchText,
        this.pageIndex + 1,
        this.pageSize
      )
      .subscribe(
        (response: any) => {
          const CITIES_DATA = response.data.map((city: any) => ({
            id: city.id,
            name: city.name,
            nameAr: city.nameAr,
            createdOn: city.createdOn,
            numberDistrict: city.numberDistrict,
            status: city.status,
          }));
          this.totalRecords = response.pagination.totalRecords;

          this.dataSource = CITIES_DATA;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Error loading coupons ', error);
        }
      );
  }

  onSearchChanged(event: string): void {
    this.searchText = event;
    this.loadCities();
  }

  onDateRangeFilterApplied(event: { fromDate: string; toDate: string }): void {
    this.startDateFilter = event.fromDate;
    this.endDateFilter = event.toDate;
    this.loadCities();
  }

  deleteCity(cityId: number): void {
    const dialogRef = this.dialog.open(PopupDeleteComponent, {
      width: '400px',
      data: {
        title: 'CONFIRM_DELETE',
        message: 'CITY_DELETE_MSG',
        confirmButton: 'YES_DELETE',
        cancelButton: 'CANCEL',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.areaApiService.deleteCity(cityId).subscribe(
          () => {
            this.openPopup();
            this.loadCities();
          },
          (error) => {
            console.error('Error deleting coupon:', error);
          }
        );
      }
    });
  }
  ChangeStatus(cityId: string, status: any): void {
    console.log(status);
    this.areaApiService.changeCityStatus(cityId, status == 1 ? 2 : 1).subscribe(
      () => {
        this.openSucess();
        this.loadCities();
      },
      (error) => {
        console.error('Error changing status:', error);
      }
    );
  }

  openSucess(): void {
    this.dialog.open(PopupSuccessComponent, {
      width: '300px',
      data: {
        message: 'CHANGED',
        button: 'CLOSE',
      },
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
