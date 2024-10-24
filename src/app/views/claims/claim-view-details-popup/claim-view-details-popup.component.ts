import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { ClaimApiService } from 'src/app/shared/services/api/claim.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
ClaimApiService;

@Component({
  selector: 'app-claim-view-details-popup',
  templateUrl: './claim-view-details-popup.component.html',
  styleUrls: ['./claim-view-details-popup.component.scss'],
  imports: [TranslateModule, NgClass, FormsModule, DatePipe],
  standalone: true,
})
export class ClaimViewDetailsPopupComponent {
  claim: any; // Adjust the type based on the actual structure of your Claim object
  claimStatus: boolean | null = null;
  currentLanguage!: string;
  constructor(
    private apiService: ClaimApiService,
    private translate: TranslationService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ClaimViewDetailsPopupComponent>
  ) {
    this.claim = data ? data.claim : null;
    this.claim.isClosed = this.claim.isClosed;
    this.currentLanguage = this.translate.getCurrentLanguage();
  }
  onStatusChange(event: any): void {
    const selectedValue = event.target.value.trim();
    this.apiService.ChangeStatus(this.claim.id, selectedValue).subscribe(
      (response: any) => {
        const updatedClaim = response.data;
        this.claim.isClosed = updatedClaim.isClosed;
        this.cdr.detectChanges();
      },
      (error: any) => {
        console.error('Error updating status:', error);
      }
    );
  }

  closePopup(): void {
    this.dialogRef.close();
  }
}
