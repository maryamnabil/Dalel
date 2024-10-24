import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxDetailsComponent } from './inbox-details.component';

describe('InboxDetailsComponent', () => {
  let component: InboxDetailsComponent;
  let fixture: ComponentFixture<InboxDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [InboxDetailsComponent]
});
    fixture = TestBed.createComponent(InboxDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
