import { TestBed } from '@angular/core/testing';

import { TopicProviderService } from './topic-provider.service';

describe('TopicProviderService', () => {
  let service: TopicProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
