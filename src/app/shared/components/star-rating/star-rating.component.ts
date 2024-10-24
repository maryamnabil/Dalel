import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [NgFor],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
})
export class StarRatingComponent {
  @Input({ required: true }) rating: number = 0;
  maxStars: number = 5;

  constructor() {}

  getStarIcon(index: number): string {
    return index < this.rating ? 'fas fa-star' : 'far fa-star';
  }
}
