import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderInGroupComponent } from './order-in-group.component';

describe('OrderInGroupComponent', () => {
  let component: OrderInGroupComponent;
  let fixture: ComponentFixture<OrderInGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderInGroupComponent]
    });
    fixture = TestBed.createComponent(OrderInGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
