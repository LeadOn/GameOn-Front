import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HomePlayersComponent } from "./home-players.component";

describe("HomePlayersComponent", () => {
  let component: HomePlayersComponent;
  let fixture: ComponentFixture<HomePlayersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomePlayersComponent],
    });
    fixture = TestBed.createComponent(HomePlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
