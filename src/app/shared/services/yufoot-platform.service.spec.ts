import { TestBed } from "@angular/core/testing";

import { YuFootPlatformService } from "./yufoot-platform.service";

describe("YuFootPlatformService", () => {
  let service: YuFootPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YuFootPlatformService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
