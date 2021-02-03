import { TestBed } from '@angular/core/testing';

import { AdvisorSearchService } from './advisor-search.service';

describe('AdvisorSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdvisorSearchService = TestBed.get(AdvisorSearchService);
    expect(service).toBeTruthy();
  });
});
