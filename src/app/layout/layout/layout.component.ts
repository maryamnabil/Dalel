import { Component } from '@angular/core';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    standalone: true,
    imports: [MatSidenavModule, SidebarComponent, HeaderComponent, RouterOutlet]
})
export class LayoutComponent {

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
