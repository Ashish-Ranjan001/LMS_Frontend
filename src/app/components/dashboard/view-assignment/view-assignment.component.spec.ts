import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssignmentComponent } from './view-assignment.component';

describe('ViewAssignmentComponent', () => {
  let component: ViewAssignmentComponent;
  let fixture: ComponentFixture<ViewAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
