import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FifaGameListHeaderComponent } from './fifa-game-list-header.component';

describe('FifaGameListHeaderComponent', () => {
  let component: FifaGameListHeaderComponent;
  let fixture: ComponentFixture<FifaGameListHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FifaGameListHeaderComponent]
    });
    fixture = TestBed.createComponent(FifaGameListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
