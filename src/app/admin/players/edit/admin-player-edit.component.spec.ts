import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminPlayerEditComponent } from "./admin-player-edit.component";

describe("AdminPlayerEditComponent", () => {
  let component: AdminPlayerEditComponent;
  let fixture: ComponentFixture<AdminPlayerEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPlayerEditComponent],
    });
    fixture = TestBed.createComponent(AdminPlayerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
