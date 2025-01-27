import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportSelectorComponent } from './sport-selector.component';

describe('SportSelectorComponent', () => {
  let component: SportSelectorComponent;
  let fixture: ComponentFixture<SportSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
