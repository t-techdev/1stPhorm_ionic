import { TestBed } from '@angular/core/testing';

import { MediaAdderService } from './media-adder.service';

describe('MediaAdderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MediaAdderService = TestBed.get(MediaAdderService);
    expect(service).toBeTruthy();
  });
});
