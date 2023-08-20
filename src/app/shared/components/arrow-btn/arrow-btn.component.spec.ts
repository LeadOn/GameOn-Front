import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ArrowBtnComponent } from "./arrow-btn.component";

describe("ArrowBtnComponent", () => {
  let component: ArrowBtnComponent;
  let fixture: ComponentFixture<ArrowBtnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArrowBtnComponent],
    });
    fixture = TestBed.createComponent(ArrowBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
