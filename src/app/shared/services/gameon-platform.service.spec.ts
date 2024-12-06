import { TestBed } from '@angular/core/testing';

import { GameOnPlatformService } from './gameon-platform.service';

describe('GameOnPlatformService', () => {
  let service: GameOnPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameOnPlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
