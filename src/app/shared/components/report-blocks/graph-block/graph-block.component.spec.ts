import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphBlockComponent } from './graph-block.component';

describe('GraphBlockComponent', () => {
  let component: GraphBlockComponent;
  let fixture: ComponentFixture<GraphBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [GraphBlockComponent]
});
    fixture = TestBed.createComponent(GraphBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
