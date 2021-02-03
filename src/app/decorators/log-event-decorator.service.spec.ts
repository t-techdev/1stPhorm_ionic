import { TestBed } from '@angular/core/testing';

import { LogEventDecoratorService } from './log-event-decorator.service';

describe('LogEventDecoratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogEventDecoratorService = TestBed.get(LogEventDecoratorService);
    expect(service).toBeTruthy();
  });
});
