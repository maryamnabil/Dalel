import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-role-form',
    templateUrl: './role-form.component.html',
    styleUrls: ['./role-form.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgIf, TranslateModule]
})
export class RoleFormComponent {

  @Input() roleForm!: FormGroup;
  @Input() formSubmitted!: boolean;

}
