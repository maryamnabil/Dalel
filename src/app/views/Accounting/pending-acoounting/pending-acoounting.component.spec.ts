import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingAcoountingComponent } from './pending-acoounting.component';

describe('PendingAcoountingComponent', () => {
  let component: PendingAcoountingComponent;
  let fixture: ComponentFixture<PendingAcoountingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingAcoountingComponent]
    });
    fixture = TestBed.createComponent(PendingAcoountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
