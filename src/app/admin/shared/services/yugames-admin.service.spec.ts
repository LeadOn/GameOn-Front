import { TestBed } from "@angular/core/testing";

import { YuGamesAdminService } from "./yugames-admin.service";

describe("YuGamesAdminService", () => {
  let service: YuGamesAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YuGamesAdminService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
