import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursemodulevideocomponentComponent } from './coursemodulevideocomponent.component';

describe('CoursemodulevideocomponentComponent', () => {
  let component: CoursemodulevideocomponentComponent;
  let fixture: ComponentFixture<CoursemodulevideocomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursemodulevideocomponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursemodulevideocomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
