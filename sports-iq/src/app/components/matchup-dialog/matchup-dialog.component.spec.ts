import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchupDialogComponent } from './matchup-dialog.component';

describe('MatchupDialogComponent', () => {
  let component: MatchupDialogComponent;
  let fixture: ComponentFixture<MatchupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchupDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
