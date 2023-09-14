import { TestBed } from "@angular/core/testing";

import { YuGamesTournamentService } from "./yugames-tournament.service";

describe("YuGamesTournamentService", () => {
  let service: YuGamesTournamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YuGamesTournamentService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
