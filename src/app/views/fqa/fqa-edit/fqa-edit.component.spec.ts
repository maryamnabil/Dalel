import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqaEditComponent } from './fqa-edit.component';

describe('FqaEditComponent', () => {
  let component: FqaEditComponent;
  let fixture: ComponentFixture<FqaEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [FqaEditComponent]
});
    fixture = TestBed.createComponent(FqaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
