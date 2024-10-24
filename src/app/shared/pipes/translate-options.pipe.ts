import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'translateOptions',
    standalone: true
})
export class TranslateOptionsPipe implements PipeTransform, OnDestroy {

    private unsubscribeAll = new Subject();

    constructor(private translate: TranslateService) { }

  transform(items: any[]): Observable<any[]> {
    if (!items) return of([]);
    return this.translate.onLangChange.pipe(
        takeUntil(this.unsubscribeAll),
        startWith({ lang: this.translate.currentLang }),
        map(event => {
            const result = items.map(item => {
                item.name = event.lang === 'ar' ? item.nameAr : item.name;
                return item;
            })
            return result;
        })
    );
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
