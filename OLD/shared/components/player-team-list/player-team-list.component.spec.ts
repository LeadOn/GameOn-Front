import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerTeamListComponent } from './player-team-list.component';

describe('PlayerTeamListComponent', () => {
  let component: PlayerTeamListComponent;
  let fixture: ComponentFixture<PlayerTeamListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerTeamListComponent]
    });
    fixture = TestBed.createComponent(PlayerTeamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
