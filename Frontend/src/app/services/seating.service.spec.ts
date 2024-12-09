import { TestBed } from '@angular/core/testing';

import { SeatingService } from './seating.service';

describe('SeatingService', () => {
  let service: SeatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
