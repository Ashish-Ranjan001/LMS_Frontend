import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleviewerComponent } from './moduleviewer.component';

describe('ModuleviewerComponent', () => {
  let component: ModuleviewerComponent;
  let fixture: ComponentFixture<ModuleviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleviewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
