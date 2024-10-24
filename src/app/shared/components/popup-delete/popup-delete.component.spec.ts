import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDeleteComponent } from './popup-delete.component';

describe('PopupConfirmComponent', () => {
  let component: PopupDeleteComponent;
  let fixture: ComponentFixture<PopupDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PopupDeleteComponent],
    });
    fixture = TestBed.createComponent(PopupDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
