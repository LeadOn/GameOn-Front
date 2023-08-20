import { TestBed } from "@angular/core/testing";

import { YuFootGameService } from "./yufoot-game.service";

describe("YuFootGameService", () => {
  let service: YuFootGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YuFootGameService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
