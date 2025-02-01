import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-win-rate-chart',
  templateUrl: './win-rate-chart.component.html',
  styleUrl: './win-rate-chart.component.scss',
  standalone: false,
})
export class WinRateChartComponent implements OnInit, OnChanges {
  @Input()
  winRate = 0.0;

  pieChart: any;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.pieChart != null) {
      this.pieChart.destroy();
    }

    this.buildWinRateChart();
  }

  buildWinRateChart() {
    this.pieChart = new Chart('win-rate-chart', {
      type: 'pie',
      data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
            ],
            hoverOffset: 4,
          },
        ],
      },
    });
  }
}
