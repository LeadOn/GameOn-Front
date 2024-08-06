import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminHighlightsComponent } from "./admin-highlights.component";

describe("AdminHighlightsComponent", () => {
  let component: AdminHighlightsComponent;
  let fixture: ComponentFixture<AdminHighlightsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminHighlightsComponent],
    });
    fixture = TestBed.createComponent(AdminHighlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
