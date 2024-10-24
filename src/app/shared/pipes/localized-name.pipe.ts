import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localizedName',
  standalone: true,
})
export class LocalizedNamePipe implements PipeTransform, OnDestroy {
  private unsubscribeAll = new Subject();

  constructor(private translate: TranslateService) {}

  transform(value: any, fieldName = 'name'): Observable<string> {
    if (!value) return of(value);

    return this.translate.onLangChange.pipe(
      takeUntil(this.unsubscribeAll),
      startWith({ lang: this.translate.currentLang }),
      map((event) => this.getLocalizedName(value, fieldName, event.lang))
    );
  }

  private getLocalizedName(
    value: any,
    fieldName: string,
    lang: string
  ): string {
    return lang === 'ar' ? value[`${fieldName}Ar`] : value[fieldName];
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
