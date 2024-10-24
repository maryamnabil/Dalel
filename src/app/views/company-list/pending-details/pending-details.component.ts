import { Component, DestroyRef, OnInit } from '@angular/core';
import { CompanyDetailsComponent } from 'src/app/shared/components/company-details/company-details.component';
import { BackwardComponent } from '../../../shared/components/backward/backward.component';
import { TranslateModule } from '@ngx-translate/core';
import { HelperService } from 'src/app/shared/services/helper.service';
import { UserService } from 'src/app/shared/services/api/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserStatusEnum } from 'src/app/core/enums/user-status.enum';
import { isValidResponse } from 'src/app/core/helper/helper';

@Component({
  selector: 'app-pending-details',
  standalone: true,
  templateUrl: './pending-details.component.html',
  styleUrls: ['./pending-details.component.scss'],
  imports: [CompanyDetailsComponent, BackwardComponent, TranslateModule],
})
export class PendingDetailsComponent implements OnInit {
  backUrl = '/admin/company-list/pending';
  companyDetails: any;
  userId: string;

  constructor(
    private helperService: HelperService,
    private userService: UserService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params?.id;
    this.getCompanyDetails();
  }

  getCompanyDetails() {
    this.userService
      .getUserDetails(this.userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.companyDetails = res?.data;
      });
  }

  onApprove() {
    this.helperService
      .openConfirmPopup('CONFIRM_UPDATE')
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.userService
            .changeUserStatus(this.userId, UserStatusEnum.Approved)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((res) => {
              if (isValidResponse(res)) {
                this.openSuccessPopup('COMPANY_APPROVED_SUCCESSFULLY');
              }
            });
        }
      });
  }

  onDecline() {
    this.helperService
      .openTextInputPopup('DECLINE_REASON', 'DESCRIBE_THE_REASON')
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((rejectionReason) => {
        if (rejectionReason) {
          this.userService
            .changeUserStatus(
              this.userId,
              UserStatusEnum.Rejected,
              rejectionReason
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((res) => {
              if (isValidResponse(res)) {
                this.openSuccessPopup('COMPANY_REJECTED_SUCCESSFULLY');
              }
            });
        }
      });
  }

  openSuccessPopup(msg: string) {
    this.helperService
      .openSuccessPopup(msg)
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigateByUrl(this.backUrl);
      });
  }
}
