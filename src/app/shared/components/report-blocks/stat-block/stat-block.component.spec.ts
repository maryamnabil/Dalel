import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatBlockComponent } from './stat-block.component';

describe('StatBlockComponent', () => {
  let component: StatBlockComponent;
  let fixture: ComponentFixture<StatBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StatBlockComponent]
});
    fixture = TestBed.createComponent(StatBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
