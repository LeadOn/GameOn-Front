import {TestBed} from "@angular/core/testing";

import {GameOnPlayerService} from "./gameon-player.service";

describe("GameOnPlayerService", () => {
  let service: GameOnPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameOnPlayerService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
