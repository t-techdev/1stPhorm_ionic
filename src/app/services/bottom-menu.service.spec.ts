import { TestBed } from '@angular/core/testing';

import { BottomMenuService } from './bottom-menu.service';

describe('BottomMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BottomMenuService = TestBed.get(BottomMenuService);
    expect(service).toBeTruthy();
  });
});
