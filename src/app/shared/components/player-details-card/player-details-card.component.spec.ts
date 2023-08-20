import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlayerDetailsCardComponent } from "./player-details-card.component";

describe("PlayerDetailsCardComponent", () => {
  let component: PlayerDetailsCardComponent;
  let fixture: ComponentFixture<PlayerDetailsCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerDetailsCardComponent],
    });
    fixture = TestBed.createComponent(PlayerDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
