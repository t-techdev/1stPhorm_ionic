import { TestBed } from '@angular/core/testing';

import { BodyMetricService } from './body-metric.service';

describe('BodyMetricService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BodyMetricService = TestBed.get(BodyMetricService);
    expect(service).toBeTruthy();
  });
});
