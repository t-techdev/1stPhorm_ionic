import { TestBed, async, inject } from '@angular/core/testing';

import { FeatureFlagGuard } from './feature-flag.guard';

describe('FeatureFlagGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeatureFlagGuard]
    });
  });

  it('should ...', inject([FeatureFlagGuard], (guard: FeatureFlagGuard) => {
    expect(guard).toBeTruthy();
  }));
});
