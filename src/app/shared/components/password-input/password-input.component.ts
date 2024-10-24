import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-password-input',
    templateUrl: './password-input.component.html',
    styleUrls: ['./password-input.component.scss'],
    standalone: true,
    imports: [FormsModule, NgIf, MatIconModule]
})
export class PasswordInputComponent {
  @Input() placeholder = '';
  @Input() id = '';
  @Output() toggleVisibility = new EventEmitter<void>();

  public password: string = '';
  public showPassword = false;

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.toggleVisibility.emit();
  }
}
