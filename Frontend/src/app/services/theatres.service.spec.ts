import { TestBed } from '@angular/core/testing';

import { TheatresService } from './theatres.service';

describe('TheatresService', () => {
  let service: TheatresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheatresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
