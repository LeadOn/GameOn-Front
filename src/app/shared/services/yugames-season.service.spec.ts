import { TestBed } from "@angular/core/testing";

import { YuGamesSeasonService } from "./yugames-season.service";

describe("YuGamesSeasonService", () => {
  let service: YuGamesSeasonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YuGamesSeasonService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
