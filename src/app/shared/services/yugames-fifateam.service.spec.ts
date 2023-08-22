import { TestBed } from "@angular/core/testing";

import { YuGamesFifaTeamService } from "./yugames-fifateam.service";

describe("YuGamesFifaTeamService", () => {
  let service: YuGamesFifaTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YuGamesFifaTeamService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
