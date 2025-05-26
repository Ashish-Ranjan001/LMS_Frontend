import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangepasswordtaComponent } from './changepasswordta.component';

describe('ChangepasswordtaComponent', () => {
  let component: ChangepasswordtaComponent;
  let fixture: ComponentFixture<ChangepasswordtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangepasswordtaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangepasswordtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
