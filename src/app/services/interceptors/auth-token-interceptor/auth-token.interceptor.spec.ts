import { TestBed } from '@angular/core/testing';

import { AuthTokenInterceptor } from './auth-token.interceptor';

describe('AuthTokenInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthTokenInterceptor = TestBed.get(AuthTokenInterceptor);
    expect(service).toBeTruthy();
  });
});
