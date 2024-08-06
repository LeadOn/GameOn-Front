import {TestBed} from "@angular/core/testing";

import {GameOnHighlightService} from "./gameon-highlight.service";

describe("GameOnHighlightService", () => {
  let service: GameOnHighlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameOnHighlightService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
