import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxAddComponent } from './inbox-add.component';

describe('InboxAddComponent', () => {
  let component: InboxAddComponent;
  let fixture: ComponentFixture<InboxAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [InboxAddComponent]
});
    fixture = TestBed.createComponent(InboxAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
