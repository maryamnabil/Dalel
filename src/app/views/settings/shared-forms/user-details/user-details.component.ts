import { Component, ViewChild, OnInit,Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AdminApiService } from 'src/app/shared/services/api/admin.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
AdminApiService
@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss'],
    standalone: true,
    imports: [NgIf, TranslateModule]
})
export class UserDetailsComponent implements OnInit {

  @Input()UserId: string='';
  User!:any

  constructor(
  private translationService: TranslationService,
  private dialog: MatDialog,
  private apiService: AdminApiService, 
  private route: ActivatedRoute,
  private router: Router,
  ){}
  ngOnInit(): void {
  
      this.apiService.getAdminDetails(this.UserId).subscribe(
        (response: any) => {
           this.User = response.data;  
       
        },
        (error) => {
          console.error('Error fetching coupon details for edit:', error);
        }
      );
   
  }
  
}
