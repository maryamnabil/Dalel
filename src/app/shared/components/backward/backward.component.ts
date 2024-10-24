import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-backward',
    templateUrl: './backward.component.html',
    styleUrls: ['./backward.component.scss'],
    standalone: true,
    imports: [RouterLink, MatIconModule]
})
export class BackwardComponent {
  @Input() linkText = '';
  @Input() backwardLink = '';
}
