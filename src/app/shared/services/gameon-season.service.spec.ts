import { TestBed } from '@angular/core/testing';

import { GameOnSeasonService } from './gameon-season.service';

describe('GameOnSeasonService', () => {
  let service: GameOnSeasonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameOnSeasonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
