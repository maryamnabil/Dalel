import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqaFormComponent } from './fqa-form.component';

describe('FqaFormComponent', () => {
  let component: FqaFormComponent;
  let fixture: ComponentFixture<FqaFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [FqaFormComponent]
});
    fixture = TestBed.createComponent(FqaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
