import { TestBed } from '@angular/core/testing';

import { UserreportService } from './userreport.service';

describe('UserreportService', () => {
  let service: UserreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
