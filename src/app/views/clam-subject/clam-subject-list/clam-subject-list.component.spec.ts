import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClamSubjectListComponent } from './clam-subject-list.component';

describe('ClamSubjectListComponent', () => {
  let component: ClamSubjectListComponent;
  let fixture: ComponentFixture<ClamSubjectListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClamSubjectListComponent]
    });
    fixture = TestBed.createComponent(ClamSubjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
