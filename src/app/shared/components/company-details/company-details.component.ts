import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Weekdays } from 'src/app/core/enums/weekdays.enum';
import { getMapLink, getWeekdayKey } from 'src/app/core/helper/helper';
import { SecureUrlPipe } from '../../pipes/secure-url.pipe';
import { LocalizedNamePipe } from '../../pipes/localized-name.pipe';
import { WorkingDays } from 'src/app/core/enums/working-days.enum';
import { SocialKey } from 'src/app/core/enums/social-key.enum';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [
    TranslateModule,
    NgClass,
    NgIf,
    NgFor,
    SecureUrlPipe,
    AsyncPipe,
    DatePipe,
    LocalizedNamePipe,
  ],
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
})
export class CompanyDetailsComponent {
  workingDays = WorkingDays;
  socialKey = SocialKey;

  @Input({ required: true }) companyDetails: any;
  @Input() isApproved: boolean;
  @Input() userWallet: any;

  @Output() recharge = new EventEmitter();
  getWeekName(week: Weekdays) {
    return getWeekdayKey(week);
  }

  getMapLink(latitude: number, longitude: number): string {
    return getMapLink(latitude, longitude);
  }

  onRecharge() {
    this.recharge.emit(true);
  }
}
