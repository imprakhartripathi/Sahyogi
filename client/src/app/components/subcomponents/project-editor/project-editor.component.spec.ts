import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEditorComponent } from './project-editor.component';

describe('ProjectEditorComponent', () => {
  let component: ProjectEditorComponent;
  let fixture: ComponentFixture<ProjectEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
