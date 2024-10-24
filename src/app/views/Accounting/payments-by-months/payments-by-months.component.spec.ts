import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsByMonthsComponent } from './payments-by-months.component';

describe('PaymentsByMonthsComponent', () => {
  let component: PaymentsByMonthsComponent;
  let fixture: ComponentFixture<PaymentsByMonthsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentsByMonthsComponent]
    });
    fixture = TestBed.createComponent(PaymentsByMonthsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
