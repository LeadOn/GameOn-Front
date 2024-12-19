import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LolPlayerCardComponent } from './lol-player-card.component';

describe('LolPlayerCardComponent', () => {
  let component: LolPlayerCardComponent;
  let fixture: ComponentFixture<LolPlayerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LolPlayerCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LolPlayerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
