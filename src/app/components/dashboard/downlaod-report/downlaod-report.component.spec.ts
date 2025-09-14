import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownlaodReportComponent } from './downlaod-report.component';

describe('DownlaodReportComponent', () => {
  let component: DownlaodReportComponent;
  let fixture: ComponentFixture<DownlaodReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownlaodReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownlaodReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
