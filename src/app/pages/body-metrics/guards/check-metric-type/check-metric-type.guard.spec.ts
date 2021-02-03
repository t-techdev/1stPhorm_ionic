import { TestBed, async, inject } from '@angular/core/testing';

import { CheckMetricTypeGuard } from './check-metric-type.guard';

describe('CheckMetricTypeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckMetricTypeGuard]
    });
  });

  it('should ...', inject([CheckMetricTypeGuard], (guard: CheckMetricTypeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
