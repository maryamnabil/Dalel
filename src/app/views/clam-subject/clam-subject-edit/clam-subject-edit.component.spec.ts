import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClamSubjectEditComponent } from './clam-subject-edit.component';

describe('ClamSubjectEditComponent', () => {
  let component: ClamSubjectEditComponent;
  let fixture: ComponentFixture<ClamSubjectEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClamSubjectEditComponent]
    });
    fixture = TestBed.createComponent(ClamSubjectEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
