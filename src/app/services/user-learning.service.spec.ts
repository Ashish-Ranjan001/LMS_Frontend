import { TestBed } from '@angular/core/testing';

import { UserLearningService } from './user-learning.service';

describe('UserLearningService', () => {
  let service: UserLearningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserLearningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
