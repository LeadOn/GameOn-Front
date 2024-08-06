import {TestBed} from "@angular/core/testing";

import {GameOnAdminService} from "./gameon-admin.service";

describe("GameOnAdminService", () => {
  let service: GameOnAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameOnAdminService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
