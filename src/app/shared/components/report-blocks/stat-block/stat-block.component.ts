import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-stat-block',
    templateUrl: './stat-block.component.html',
    styleUrls: ['./stat-block.component.scss'],
    standalone: true,
    imports: [NgIf, RouterLink, TranslateModule]
})
export class StatBlockComponent {
  @Input() title = '';
  @Input() number= '';
  @Input() link = '';
  @Input() percentage = '';
  @Input() icon = '';

  @Input() showViewAll = false;
  @Input() showPercentage = false;
}
