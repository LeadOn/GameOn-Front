import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalterodataPocCompetitionComponent } from './halterodata-poc-competition.component';

describe('HalterodataPocCompetitionComponent', () => {
  let component: HalterodataPocCompetitionComponent;
  let fixture: ComponentFixture<HalterodataPocCompetitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HalterodataPocCompetitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HalterodataPocCompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
