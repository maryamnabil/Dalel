import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClamSubjectAddComponent } from './clam-subject-add.component';

describe('ClamSubjectAddComponent', () => {
  let component: ClamSubjectAddComponent;
  let fixture: ComponentFixture<ClamSubjectAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClamSubjectAddComponent]
    });
    fixture = TestBed.createComponent(ClamSubjectAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
