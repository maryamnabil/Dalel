import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLanguageSubject.next(lang);

    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }

    document.body.classList.toggle('arabic');
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || this.translate.defaultLang;
  }


}
