import { TestBed } from "@angular/core/testing";

import { YuGamesGameService } from "./yugames-game.service";

describe("YuGamesGameService", () => {
  let service: YuGamesGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YuGamesGameService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
