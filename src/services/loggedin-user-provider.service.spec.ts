import { TestBed } from '@angular/core/testing';

import { LoggedinUserProviderService } from './loggedin-user-provider.service';

describe('LoggedinUserProviderService', () => {
  let service: LoggedinUserProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggedinUserProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
