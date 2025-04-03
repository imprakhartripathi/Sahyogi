import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCreatorComponent } from './project-creator.component';

describe('ProjectCreatorComponent', () => {
  let component: ProjectCreatorComponent;
  let fixture: ComponentFixture<ProjectCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
