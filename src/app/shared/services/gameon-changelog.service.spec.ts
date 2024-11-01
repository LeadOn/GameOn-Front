import { TestBed } from '@angular/core/testing';

import { GameOnChangelogService } from './gameon-changelog.service';

describe('GameOnChangelogService', () => {
  let service: GameOnChangelogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameOnChangelogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
