import { TestBed } from "@angular/core/testing";

import { YuFootHighlightService } from "./yufoot-highlight.service";

describe("YuFootHighlightService", () => {
  let service: YuFootHighlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YuFootHighlightService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
