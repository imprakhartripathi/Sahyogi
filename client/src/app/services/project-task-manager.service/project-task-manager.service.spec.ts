import { TestBed } from '@angular/core/testing';

import { ProjectTaskManagerService } from './project-task-manager.service';

describe('ProjectTaskManagerService', () => {
  let service: ProjectTaskManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectTaskManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
