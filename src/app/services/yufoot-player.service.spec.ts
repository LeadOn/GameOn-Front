import { TestBed } from "@angular/core/testing";

import { YuFootPlayerService } from "./yufoot-player.service";

describe("YuFootPlayerService", () => {
  let service: YuFootPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YuFootPlayerService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
