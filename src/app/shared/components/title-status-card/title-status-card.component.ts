import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-title-status-card',
  standalone: true,
  imports: [TranslateModule, NgIf],
  templateUrl: './title-status-card.component.html',
  styleUrls: ['./title-status-card.component.scss'],
})
export class TitleStatusCardComponent {
  @Input({ required: true }) title: string;
  @Input({ required: true }) number: string;
}
