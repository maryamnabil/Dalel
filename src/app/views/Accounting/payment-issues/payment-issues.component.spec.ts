import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentIssuesComponent } from './payment-issues.component';

describe('PaymentIssuesComponent', () => {
  let component: PaymentIssuesComponent;
  let fixture: ComponentFixture<PaymentIssuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentIssuesComponent]
    });
    fixture = TestBed.createComponent(PaymentIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
