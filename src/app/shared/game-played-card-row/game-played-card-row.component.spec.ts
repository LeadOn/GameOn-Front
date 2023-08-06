import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePlayedCardRowComponent } from './game-played-card-row.component';

describe('GamePlayedCardRowComponent', () => {
  let component: GamePlayedCardRowComponent;
  let fixture: ComponentFixture<GamePlayedCardRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GamePlayedCardRowComponent]
    });
    fixture = TestBed.createComponent(GamePlayedCardRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
