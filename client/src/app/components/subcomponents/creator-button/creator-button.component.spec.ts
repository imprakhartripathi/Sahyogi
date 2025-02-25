import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorButtonComponent } from './creator-button.component';

describe('CreatorButtonComponent', () => {
  let component: CreatorButtonComponent;
  let fixture: ComponentFixture<CreatorButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatorButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatorButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
