import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FifaStatComponent } from './fifa-stat.component';

describe('FifaStatComponent', () => {
  let component: FifaStatComponent;
  let fixture: ComponentFixture<FifaStatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FifaStatComponent]
    });
    fixture = TestBed.createComponent(FifaStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
