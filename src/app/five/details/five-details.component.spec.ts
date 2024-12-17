import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiveDetailsComponent } from './five-details.component';

describe('FiveDetailsComponent', () => {
  let component: FiveDetailsComponent;
  let fixture: ComponentFixture<FiveDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiveDetailsComponent],
    });
    fixture = TestBed.createComponent(FiveDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
