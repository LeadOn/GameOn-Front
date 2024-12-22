import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinRateChartComponent } from './win-rate-chart.component';

describe('WinRateChartComponent', () => {
  let component: WinRateChartComponent;
  let fixture: ComponentFixture<WinRateChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WinRateChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinRateChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
