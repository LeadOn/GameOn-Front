import { TestBed } from "@angular/core/testing";

import { YuFootFifaTeamService } from "./yufoot-fifateam.service";

describe("YuFootFifaTeamService", () => {
  let service: YuFootFifaTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YuFootFifaTeamService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
