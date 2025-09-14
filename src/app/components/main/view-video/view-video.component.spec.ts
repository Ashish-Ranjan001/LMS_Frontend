import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVideoComponent } from './view-video.component';

describe('ViewVideoComponent', () => {
  let component: ViewVideoComponent;
  let fixture: ComponentFixture<ViewVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
