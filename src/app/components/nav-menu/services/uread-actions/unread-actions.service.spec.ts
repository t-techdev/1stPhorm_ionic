import { TestBed } from '@angular/core/testing';

import { UnreadActionsService } from './unread-actions.service';

describe('UnreadActionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnreadActionsService = TestBed.get(UnreadActionsService);
    expect(service).toBeTruthy();
  });
});
