import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityFormComponent } from './city-form.component';

describe('CouponFormComponent', () => {
  let component: CityFormComponent;
  let fixture: ComponentFixture<CityFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CityFormComponent],
    });
    fixture = TestBed.createComponent(CityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
