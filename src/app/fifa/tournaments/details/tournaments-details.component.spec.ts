import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentsDetailsComponent } from './tournaments-details.component';

describe('TournamentsDetailsComponent', () => {
  let component: TournamentsDetailsComponent;
  let fixture: ComponentFixture<TournamentsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TournamentsDetailsComponent],
    });
    fixture = TestBed.createComponent(TournamentsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
