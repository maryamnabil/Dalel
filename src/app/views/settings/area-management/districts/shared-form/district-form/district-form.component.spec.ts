import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictFormComponent } from './district-form.component';

describe('DistrictFormComponent', () => {
  let component: DistrictFormComponent;
  let fixture: ComponentFixture<DistrictFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DistrictFormComponent],
    });
    fixture = TestBed.createComponent(DistrictFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
