import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPromosUseageCountComponent } from './get-promos-useage-count.component';

describe('GetPromosUseageCountComponent', () => {
  let component: GetPromosUseageCountComponent;
  let fixture: ComponentFixture<GetPromosUseageCountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [GetPromosUseageCountComponent]
});
    fixture = TestBed.createComponent(GetPromosUseageCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
