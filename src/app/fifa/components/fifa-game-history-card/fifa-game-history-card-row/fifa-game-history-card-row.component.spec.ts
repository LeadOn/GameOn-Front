import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FifaGameHistoryCardRowComponent } from "./fifa-game-history-card-row.component";

describe("FifaGameHistoryCardRowComponent", () => {
  let component: FifaGameHistoryCardRowComponent;
  let fixture: ComponentFixture<FifaGameHistoryCardRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FifaGameHistoryCardRowComponent],
    });
    fixture = TestBed.createComponent(FifaGameHistoryCardRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
