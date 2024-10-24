import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementAddComponent } from './announcement-add.component';

describe('AnnouncementAddComponent', () => {
  let component: AnnouncementAddComponent;
  let fixture: ComponentFixture<AnnouncementAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnouncementAddComponent]
    });
    fixture = TestBed.createComponent(AnnouncementAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
