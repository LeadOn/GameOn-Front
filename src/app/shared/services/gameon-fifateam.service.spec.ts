import { TestBed } from '@angular/core/testing';

import { GameOnFifaTeamService } from './gameon-fifateam.service';

describe('GameOnFifaTeamService', () => {
  let service: GameOnFifaTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameOnFifaTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
