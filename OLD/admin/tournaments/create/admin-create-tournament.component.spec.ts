import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminCreateTournamentComponent } from "./admin-create-tournament.component";

describe("AdminCreateTournamentComponent", () => {
  let component: AdminCreateTournamentComponent;
  let fixture: ComponentFixture<AdminCreateTournamentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCreateTournamentComponent],
    });
    fixture = TestBed.createComponent(AdminCreateTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
