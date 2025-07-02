import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseModuleViewComponent } from './courses-details.component';

describe('CoursesDetailsComponent', () => {
  let component: CourseModuleViewComponent;
  let fixture: ComponentFixture<CourseModuleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseModuleViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseModuleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
