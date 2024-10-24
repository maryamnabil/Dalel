import { Component, DestroyRef, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { BackwardComponent } from '../../../../shared/components/backward/backward.component';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedNamePipe } from 'src/app/shared/pipes/localized-name.pipe';
import { SecureUrlPipe } from 'src/app/shared/pipes/secure-url.pipe';
import { getFileName, isValidResponse } from 'src/app/core/helper/helper';
import { NewsApiService } from 'src/app/shared/services/api/news.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-news-details',
  standalone: true,
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.scss'],
  imports: [
    BackwardComponent,
    TranslateModule,
    NgFor,
    NgIf,
    LocalizedNamePipe,
    AsyncPipe,
    SecureUrlPipe,
  ],
})
export class NewsDetailsComponent implements OnInit {
  backUrl = '/admin/settings/news/news-list';
  details: any;

  constructor(
    private apiService: NewsApiService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails() {
    const { id } = this.route.snapshot.params;
    this.apiService
      .getNewsById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (isValidResponse(res)) {
          this.details = res?.data;
        }
      });
  }

  getFileName(filePath: string) {
    return getFileName(filePath);
  }
}
