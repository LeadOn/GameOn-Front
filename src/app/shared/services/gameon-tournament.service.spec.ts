import {TestBed} from "@angular/core/testing";

import {GameOnTournamentService} from "./gameon-tournament.service";

describe("GameOnTournamentService", () => {
  let service: GameOnTournamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameOnTournamentService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
