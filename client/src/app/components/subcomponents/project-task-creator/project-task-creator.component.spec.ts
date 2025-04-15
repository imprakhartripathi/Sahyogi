import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskCreatorComponent } from './project-task-creator.component';

describe('ProjectTaskCreatorComponent', () => {
  let component: ProjectTaskCreatorComponent;
  let fixture: ComponentFixture<ProjectTaskCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectTaskCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectTaskCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
