import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UpdatePlayerTabComponent } from "./update-player-tab.component";

describe("UpdatePlayerTabComponent", () => {
  let component: UpdatePlayerTabComponent;
  let fixture: ComponentFixture<UpdatePlayerTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePlayerTabComponent],
    });
    fixture = TestBed.createComponent(UpdatePlayerTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
