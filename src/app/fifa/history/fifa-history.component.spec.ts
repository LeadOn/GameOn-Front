import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FifaHistoryComponent } from './fifa-history.component';

describe('FifaHistoryComponent', () => {
  let component: FifaHistoryComponent;
  let fixture: ComponentFixture<FifaHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FifaHistoryComponent]
    });
    fixture = TestBed.createComponent(FifaHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
