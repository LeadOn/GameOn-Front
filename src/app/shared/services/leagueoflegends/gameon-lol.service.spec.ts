import { TestBed } from '@angular/core/testing';

import { GameOnLoLService } from './gameon-lol.service';

describe('GameOnLoLService', () => {
  let service: GameOnLoLService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameOnLoLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
