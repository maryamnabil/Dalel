import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditnComponent } from './admin-editn.component';

describe('AdminEditnComponent', () => {
  let component: AdminEditnComponent;
  let fixture: ComponentFixture<AdminEditnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [AdminEditnComponent]
});
    fixture = TestBed.createComponent(AdminEditnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
