import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimViewDetailsPopupComponent } from './claim-view-details-popup.component';

describe('ClaimViewDetailsPopupComponent', () => {
  let component: ClaimViewDetailsPopupComponent;
  let fixture: ComponentFixture<ClaimViewDetailsPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimViewDetailsPopupComponent]
    });
    fixture = TestBed.createComponent(ClaimViewDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
