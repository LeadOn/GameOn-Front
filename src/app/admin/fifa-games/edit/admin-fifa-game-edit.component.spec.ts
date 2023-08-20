import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminFifaGameEditComponent } from "./admin-fifa-game-edit.component";

describe("AdminFifaGameEditComponent", () => {
  let component: AdminFifaGameEditComponent;
  let fixture: ComponentFixture<AdminFifaGameEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminFifaGameEditComponent],
    });
    fixture = TestBed.createComponent(AdminFifaGameEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
