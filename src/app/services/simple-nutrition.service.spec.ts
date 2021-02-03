import { TestBed } from '@angular/core/testing';

import { SimpleNutritionService } from './simple-nutrition.service';

describe('SimpleNutritionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimpleNutritionService = TestBed.get(SimpleNutritionService);
    expect(service).toBeTruthy();
  });
});
