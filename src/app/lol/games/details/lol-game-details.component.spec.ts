import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LolGameDetailsComponent } from './lol-game-details.component';

describe('LolGameDetailsComponent', () => {
  let component: LolGameDetailsComponent;
  let fixture: ComponentFixture<LolGameDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LolGameDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LolGameDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
