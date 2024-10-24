import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedPaymentComponent } from './fixed-payment.component';

describe('FixedPaymentComponent', () => {
  let component: FixedPaymentComponent;
  let fixture: ComponentFixture<FixedPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FixedPaymentComponent]
    });
    fixture = TestBed.createComponent(FixedPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
