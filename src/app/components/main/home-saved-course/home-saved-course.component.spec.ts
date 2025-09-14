import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSavedCourseComponent } from './home-saved-course.component';

describe('HomeSavedCourseComponent', () => {
  let component: HomeSavedCourseComponent;
  let fixture: ComponentFixture<HomeSavedCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSavedCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSavedCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
