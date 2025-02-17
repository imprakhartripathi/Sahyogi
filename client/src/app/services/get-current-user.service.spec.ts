import { TestBed } from '@angular/core/testing';

import { GetCurrentUserService } from './get-current-user.service';

describe('GetCurrentUserService', () => {
  let service: GetCurrentUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCurrentUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
