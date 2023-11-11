import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentsHomeComponent } from './tournaments-home.component';

describe('TournamentsHomeComponent', () => {
  let component: TournamentsHomeComponent;
  let fixture: ComponentFixture<TournamentsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TournamentsHomeComponent]
    });
    fixture = TestBed.createComponent(TournamentsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
