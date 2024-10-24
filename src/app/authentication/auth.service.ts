// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {}

  isLoggedIn(): boolean {
    // Check if user is logged in based on a token
    return !!this.localStorageService.getItem('token');
  }

  logout(): void {
    // Clear user token
    localStorage.removeItem('token');

    // Redirect to the login page
    this.router.navigate(['/login']);
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }
}
