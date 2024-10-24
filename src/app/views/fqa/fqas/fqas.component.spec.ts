import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqasComponent } from './fqas.component';

describe('FqasComponent', () => {
  let component: FqasComponent;
  let fixture: ComponentFixture<FqasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [FqasComponent]
});
    fixture = TestBed.createComponent(FqasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
