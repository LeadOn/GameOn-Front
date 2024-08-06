import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminPlatformEditComponent } from "./admin-platform-edit.component";

describe("AdminPlatformEditComponent", () => {
  let component: AdminPlatformEditComponent;
  let fixture: ComponentFixture<AdminPlatformEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPlatformEditComponent],
    });
    fixture = TestBed.createComponent(AdminPlatformEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
