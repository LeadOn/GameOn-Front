import { TestBed } from '@angular/core/testing';

import { GameonSoccerfiveService } from './gameon-soccerfive.service';

describe('GameonSoccerfiveService', () => {
  let service: GameonSoccerfiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameonSoccerfiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
