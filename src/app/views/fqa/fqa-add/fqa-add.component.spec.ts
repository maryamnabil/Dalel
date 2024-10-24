import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqaAddComponent } from './fqa-add.component';

describe('FqaAddComponent', () => {
  let component: FqaAddComponent;
  let fixture: ComponentFixture<FqaAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [FqaAddComponent]
});
    fixture = TestBed.createComponent(FqaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
