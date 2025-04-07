import { TestBed } from '@angular/core/testing';

import { ProjectTransferService } from './project-transfer.service';

describe('ProjectTransferService', () => {
  let service: ProjectTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
