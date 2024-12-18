import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinnerTinyComponent } from './loading-spinner-tiny.component';

describe('LoadingSpinnerTinyComponent', () => {
  let component: LoadingSpinnerTinyComponent;
  let fixture: ComponentFixture<LoadingSpinnerTinyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingSpinnerTinyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerTinyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
