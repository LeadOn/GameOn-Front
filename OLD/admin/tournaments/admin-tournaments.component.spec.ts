import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminTournamentsComponent } from "./admin-tournaments.component";

describe("AdminTournamentsComponent", () => {
  let component: AdminTournamentsComponent;
  let fixture: ComponentFixture<AdminTournamentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTournamentsComponent],
    });
    fixture = TestBed.createComponent(AdminTournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
