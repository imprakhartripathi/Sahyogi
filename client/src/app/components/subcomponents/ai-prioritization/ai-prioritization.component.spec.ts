import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiPrioritizationComponent } from './ai-prioritization.component';

describe('AiPrioritizationComponent', () => {
  let component: AiPrioritizationComponent;
  let fixture: ComponentFixture<AiPrioritizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiPrioritizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiPrioritizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
