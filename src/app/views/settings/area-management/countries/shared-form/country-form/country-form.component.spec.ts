import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryFormComponent } from './country-form.component';

describe('CouponFormComponent', () => {
  let component: CountryFormComponent;
  let fixture: ComponentFixture<CountryFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CountryFormComponent],
    });
    fixture = TestBed.createComponent(CountryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
