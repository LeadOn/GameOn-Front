import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankHistoryComponent } from './rank-history.component';

describe('RankHistoryComponent', () => {
  let component: RankHistoryComponent;
  let fixture: ComponentFixture<RankHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RankHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
