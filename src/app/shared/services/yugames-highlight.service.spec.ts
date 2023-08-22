import { TestBed } from "@angular/core/testing";

import { YuGamesHighlightService } from "./yugames-highlight.service";

describe("YuGamesHighlightService", () => {
  let service: YuGamesHighlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YuGamesHighlightService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
