import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminPlayersComponent } from "./admin-players.component";

describe("AdminPlayersComponent", () => {
  let component: AdminPlayersComponent;
  let fixture: ComponentFixture<AdminPlayersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPlayersComponent],
    });
    fixture = TestBed.createComponent(AdminPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
