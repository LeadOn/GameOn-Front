import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalterodataPocHomeComponent } from './halterodata-poc-home.component';

describe('HalterodataPocHomeComponent', () => {
  let component: HalterodataPocHomeComponent;
  let fixture: ComponentFixture<HalterodataPocHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HalterodataPocHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HalterodataPocHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
