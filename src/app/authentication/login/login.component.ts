import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginApiService } from 'src/app/shared/services/api/login.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AuthService } from '../auth.service';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatIconModule,
    TranslateModule,
    MatDialogModule,
  ],
})
export class LoginComponent implements OnInit {
  public showPassword = false;
  loginForm!: FormGroup;

  constructor(
    private apiService: LoginApiService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  // Show and hide passowrd
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Login
  ngOnInit(): void {
    this.initLoginForm();

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      useremail: [
        '',
        [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const useremail = this.loginForm.value.useremail;
      const psw = this.loginForm.value.password;
      this.apiService.loginAPI(useremail, psw).subscribe(
        (response) => {
          console.log(response.statusCode);
          if (response.statusCode == '200') {
            this.localStorageService.setItem('token', response.data.token);
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.openPopup();
          }
        },
        (error) => {
          console.error('Login Error:', error);
        }
      );
    }
  }

  get useremail() {
    return this.loginForm.get('useremail');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Error Popup
  openPopup(): void {
    this.dialog.open(PopupComponent, {
      width: '300px',
      data: {
        message: 'SIGN_INVALID',
        button: 'RETRY',
      },
    });
  }
}
