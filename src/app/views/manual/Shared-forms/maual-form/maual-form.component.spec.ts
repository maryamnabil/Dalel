import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaualFormComponent } from './maual-form.component';

describe('MaualFormComponent', () => {
  let component: MaualFormComponent;
  let fixture: ComponentFixture<MaualFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaualFormComponent]
    });
    fixture = TestBed.createComponent(MaualFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
