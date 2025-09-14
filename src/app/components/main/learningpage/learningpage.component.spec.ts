import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningpageComponent } from './learningpage.component';

describe('LearningpageComponent', () => {
  let component: LearningpageComponent;
  let fixture: ComponentFixture<LearningpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
