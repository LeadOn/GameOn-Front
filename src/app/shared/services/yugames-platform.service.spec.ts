import { TestBed } from "@angular/core/testing";

import { YuGamesPlatformService } from "./yugames-platform.service";

describe("YuGamesPlatformService", () => {
  let service: YuGamesPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YuGamesPlatformService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
