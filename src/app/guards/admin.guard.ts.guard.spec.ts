import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminGuardTsGuard } from './admin.guard.ts.guard';

describe('adminGuardTsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminGuardTsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
