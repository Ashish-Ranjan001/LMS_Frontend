import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { guestGuardTsGuard } from './guest.guard.ts.guard';

describe('guestGuardTsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => guestGuardTsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
