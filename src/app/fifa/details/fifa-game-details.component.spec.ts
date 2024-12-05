import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FifaGameDetailsComponent } from './fifa-game-details.component';

describe('FifaGameDetailsComponent', () => {
  let component: FifaGameDetailsComponent;
  let fixture: ComponentFixture<FifaGameDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FifaGameDetailsComponent],
    });
    fixture = TestBed.createComponent(FifaGameDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
