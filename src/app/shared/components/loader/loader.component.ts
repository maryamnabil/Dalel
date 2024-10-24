import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-loader',
  template: `
    <div class="loader-container" *ngIf="(isLoading$ | async)! > 0">
      <div class="loader"></div>
    </div>
  `,
  styles: [
    `
      .loader-container {
        position: fixed;
        inset: 0;
        z-index: 999999999999;
        margin: 0;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
      }

      div.loader {
        width: 8vmax;
        height: 8vmax;
        border-right: 4px solid var(--primary);
        border-radius: 100%;
        animation: spinRight 800ms linear infinite;

        &:before,
        &:after {
          content: '';
          width: 6vmax;
          height: 6vmax;
          display: block;
          position: absolute;
          top: calc(50% - 3vmax);
          left: calc(50% - 3vmax);
          border-left: 3px solid #fff;
          border-radius: 100%;
          animation: spinLeft 800ms linear infinite;
        }

        &:after {
          width: 4vmax;
          height: 4vmax;
          top: calc(50% - 2vmax);
          left: calc(50% - 2vmax);
          border: 0;
          border-right: 2px solid var(--primary);
          animation: none;
        }
      }

      @keyframes spinLeft {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(720deg);
        }
      }

      @keyframes spinRight {
        from {
          transform: rotate(360deg);
        }
        to {
          transform: rotate(0deg);
        }
      }
    `,
  ],
  standalone: true,
  imports: [NgIf, AsyncPipe],
})
export class LoaderComponent {
  isLoading$ = this.loaderService.getLoaderState();

  constructor(private loaderService: LoaderService) {}
}
