import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingCounter = 0;
  private loadingCounter$ = new BehaviorSubject<number>(0);

  show() {
    this.loadingCounter++;
    this.loadingCounter$.next(this.loadingCounter);
  }

  hide() {
    this.loadingCounter--;
    this.loadingCounter$.next(this.loadingCounter);
  }

  getLoaderState() {
    return this.loadingCounter$.asObservable();
  }
}
