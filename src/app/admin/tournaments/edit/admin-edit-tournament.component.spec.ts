import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminEditTournamentComponent } from "./admin-edit-tournament.component";

describe("AdminEditTournamentComponent", () => {
  let component: AdminEditTournamentComponent;
  let fixture: ComponentFixture<AdminEditTournamentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminEditTournamentComponent],
    });
    fixture = TestBed.createComponent(AdminEditTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
