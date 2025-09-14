import { TestBed } from '@angular/core/testing';

import { SaveFavoriteCourseServiceService } from './save-favorite-course-service.service';

describe('SaveFavoriteCourseServiceService', () => {
  let service: SaveFavoriteCourseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveFavoriteCourseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
