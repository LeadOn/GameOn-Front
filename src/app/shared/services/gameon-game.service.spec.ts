import {TestBed} from "@angular/core/testing";

import {GameOnGameService} from "./gameon-game.service";

describe("GameOnGameService", () => {
  let service: GameOnGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameOnGameService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
