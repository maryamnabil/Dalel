import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import { NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, NgIf]
})

export class HeaderComponent {

  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  @Output() toggleRTL: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}


  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }


  toggleLanguage () {
    this.toggleRTL.emit();
  }


  logout(): void {
    this.authService.logout();
  }

}
