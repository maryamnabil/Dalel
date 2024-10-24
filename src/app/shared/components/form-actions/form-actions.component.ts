import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-form-actions',
    templateUrl: './form-actions.component.html',
    styleUrls: ['./form-actions.component.scss'],
    standalone: true,
    imports: [TranslateModule]
})
export class FormActionsComponent {
  @Input() buttonPrimaryText = '';
  @Input() buttonPrimaryTarget = '';

  @Output() submitForm: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
}
