import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalterodataPocAthleteComponent } from './halterodata-poc-athlete.component';

describe('HalterodataPocAthleteComponent', () => {
  let component: HalterodataPocAthleteComponent;
  let fixture: ComponentFixture<HalterodataPocAthleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HalterodataPocAthleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HalterodataPocAthleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
