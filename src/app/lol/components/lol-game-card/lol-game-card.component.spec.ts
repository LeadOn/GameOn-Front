import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoLGameCardComponent } from './lol-game-card.component';

describe('LoLGameCardComponent', () => {
  let component: LoLGameCardComponent;
  let fixture: ComponentFixture<LoLGameCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoLGameCardComponent],
    });
    fixture = TestBed.createComponent(LoLGameCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
