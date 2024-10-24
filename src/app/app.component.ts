import { Component } from '@angular/core';
import { TranslationService } from './shared/services/translation.service';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/components/loader/loader.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, LoaderComponent],
})
export class AppComponent {
  title = 'dalelak_admin';
  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  isRTL = false;

  constructor(private translationService: TranslationService) {}

  toggleRTL(): void {
    this.isRTL = !this.isRTL;
    this.translationService.setLanguage(this.isRTL ? 'ar' : 'en');
  }
}
