import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClamSubjectFormComponent } from './clam-subject-form.component';

describe('ClamSubjectFormComponent', () => {
  let component: ClamSubjectFormComponent;
  let fixture: ComponentFixture<ClamSubjectFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClamSubjectFormComponent]
    });
    fixture = TestBed.createComponent(ClamSubjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
