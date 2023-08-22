import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FifaGameHistoryCardComponent } from './fifa-game-history-card.component';

describe('FifaGameHistoryCardComponent', () => {
  let component: FifaGameHistoryCardComponent;
  let fixture: ComponentFixture<FifaGameHistoryCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FifaGameHistoryCardComponent]
    });
    fixture = TestBed.createComponent(FifaGameHistoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
