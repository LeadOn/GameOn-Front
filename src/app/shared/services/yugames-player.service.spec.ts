import { TestBed } from "@angular/core/testing";

import { YuGamesPlayerService } from "./yugames-player.service";

describe("YuGamesPlayerService", () => {
  let service: YuGamesPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YuGamesPlayerService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
