import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import { LeagueOfLegendsRankHistory } from '../../../../../shared/classes/lol/LeagueOfLegendsRankHistory';

@Component({
  selector: 'app-rank-history',
  templateUrl: './rank-history.component.html',
  styleUrl: './rank-history.component.css',
  standalone: false,
})
export class RankHistoryComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input()
  rankHistory: LeagueOfLegendsRankHistory[] = [];

  @ViewChild('rankHistoryChart')
  rankHistoryChart?: ElementRef<HTMLCanvasElement>;

  chart: any;
  ngAfterViewInit(): void {
    this.rebuildChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rankHistory']) {
      queueMicrotask(() => this.rebuildChart());
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  destroyChart() {
    if (this.chart != null) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  rebuildChart() {
    this.destroyChart();

    if (this.rankHistory == null || this.rankHistory.length === 0) {
      return;
    }

    this.buildChart();
  }

  buildChart() {
    if (this.rankHistoryChart == null) {
      return;
    }

    const isMobileViewport =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches;

    const existingChart = Chart.getChart(this.rankHistoryChart.nativeElement);

    if (existingChart != null) {
      existingChart.destroy();
    }

    let soloRankedHistory = this.rankHistory.filter(
      (history) => history.queueType === 'RANKED_SOLO_5x5',
    );

    let flexRankedHistory = this.rankHistory.filter(
      (history) => history.queueType === 'RANKED_FLEX_SR',
    );

    let fiveLabels: string[] = [];
    let flexLabels: string[] = [];
    let fiveValues: string[] = [];
    let flexValues: string[] = [];

    let datasets = [];

    soloRankedHistory.forEach((history) => {
      fiveLabels.push(history.createdOn.toString().split('T')[0]);

      let points = 0;

      switch (history.tier) {
        case 'IRON':
          points += 0;
          break;

        case 'BRONZE':
          points += 400;
          break;

        case 'SILVER':
          points += 800;
          break;

        case 'GOLD':
          points += 1200;
          break;

        case 'EMERALD':
          points += 1600;
          break;

        case 'PLATINUM':
          points += 2000;
          break;

        case 'DIAMOND':
          points += 2400;
          break;

        case 'MASTER':
          points += 2800;
          break;

        case 'CHALLENGER':
          points += 2800;
          break;

        default:
          break;
      }

      switch (history.rank) {
        case 'I':
          points += 300;
          break;

        case 'II':
          points += 200;
          break;

        case 'III':
          points += 100;
          break;

        case 'IV':
          points += 0;
          break;

        default:
          break;
      }

      points += history.leaguePoints;

      fiveValues.push(points.toString());
    });

    flexRankedHistory.forEach((history) => {
      flexLabels.push(history.createdOn.toString().split('T')[0]);

      let points = 0;

      switch (history.tier) {
        case 'IRON':
          points += 0;
          break;

        case 'BRONZE':
          points += 400;
          break;

        case 'SILVER':
          points += 800;
          break;

        case 'GOLD':
          points += 1200;
          break;

        case 'EMERALD':
          points += 1600;
          break;

        case 'PLATINUM':
          points += 2000;
          break;

        case 'DIAMOND':
          points += 2400;
          break;

        case 'MASTER':
          points += 2800;
          break;

        case 'CHALLENGER':
          points += 2800;
          break;

        default:
          break;
      }

      switch (history.rank) {
        case 'I':
          points += 300;
          break;

        case 'II':
          points += 200;
          break;

        case 'III':
          points += 100;
          break;

        case 'IV':
          points += 0;
          break;

        default:
          break;
      }

      points += history.leaguePoints;

      flexValues.push(points.toString());
    });

    if (fiveLabels.length === 0 && flexLabels.length > 0) {
      fiveLabels = flexLabels;
    }

    // Now adding values if length isn't equal between queues
    if (fiveValues.length > flexValues.length) {
      while (flexValues.length < fiveValues.length) {
        flexValues.unshift('0');
      }
    }

    if (flexValues.length > fiveValues.length) {
      while (fiveValues.length < flexValues.length) {
        fiveValues.unshift('0');
      }
    }

    if (soloRankedHistory.length != 0) {
      datasets.push({
        label: 'Solo 5v5',
        data: fiveValues,
        backgroundColor: 'rgba(115, 195, 233, 0.2)',
        borderColor: '#73C3E9',
        borderWidth: 2,
        pointBackgroundColor: '#73C3E9',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      });
    }

    if (flexRankedHistory.length != 0) {
      datasets.push({
        label: 'Flex 5v5',
        data: flexValues,
        backgroundColor: 'rgba(89, 149, 140, 0.2)',
        borderColor: '#59958c',
        borderWidth: 2,
        pointBackgroundColor: '#59958c',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      });
    }

    this.chart = new Chart(this.rankHistoryChart.nativeElement, {
      type: 'line',
      data: {
        // values on X-Axis
        labels: fiveLabels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: !isMobileViewport,
        aspectRatio: isMobileViewport ? 1.4 : 2.5,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: 'rgba(156, 163, 175, 0.2)',
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: isMobileViewport ? 5 : 10,
              maxRotation: isMobileViewport ? 0 : 45,
              minRotation: 0,
              font: {
                size: isMobileViewport ? 10 : 11,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: 'rgba(156, 163, 175, 0.2)',
            },
            ticks: {
              maxTicksLimit: isMobileViewport ? 6 : 8,
              font: {
                size: isMobileViewport ? 10 : 11,
              },
              callback: (tickValue, index) => {
                return this.generateDisplayValue(tickValue.toString());
              },
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: isMobileViewport ? 'bottom' : 'top',
            align: isMobileViewport ? 'center' : 'end',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: isMobileViewport ? 10 : 15,
              font: {
                size: isMobileViewport ? 11 : 12,
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 10,
            titleFont: {
              size: 13,
            },
            bodyFont: {
              size: 12,
            },
            cornerRadius: 6,
            displayColors: true,
            callbacks: {
              title: function (context) {
                return context[0].label;
              },
              label: function (context) {
                const label = context.dataset.label || '';
                let numericValue = parseInt(
                  context.parsed?.y?.toString() ?? '0',
                );

                if (numericValue < 400) {
                  if (numericValue <= 99) {
                    return 'Iron IV';
                  } else if (numericValue >= 100 && numericValue < 200) {
                    return 'Iron III ' + (numericValue - 100) + ' LP';
                  } else if (numericValue >= 200 && numericValue < 300) {
                    return 'Iron II ' + (numericValue - 200) + ' LP';
                  } else if (numericValue >= 300 && numericValue < 400) {
                    return 'Iron I ' + (numericValue - 300) + ' LP';
                  }
                } else if (numericValue >= 400 && numericValue < 800) {
                  if (numericValue >= 400 && numericValue < 500) {
                    return 'Bronze IV ' + (numericValue - 400) + ' LP';
                  } else if (numericValue >= 500 && numericValue < 600) {
                    return 'Bronze III ' + (numericValue - 500) + ' LP';
                  } else if (numericValue >= 600 && numericValue < 700) {
                    return 'Bronze II ' + (numericValue - 600) + ' LP';
                  } else if (numericValue >= 700 && numericValue < 800) {
                    return 'Bronze I ' + (numericValue - 700) + ' LP';
                  }
                } else if (numericValue >= 800 && numericValue < 1200) {
                  if (numericValue >= 800 && numericValue < 900) {
                    return 'Silver IV ' + (numericValue - 800) + ' LP';
                  } else if (numericValue >= 900 && numericValue < 1000) {
                    return 'Silver III ' + (numericValue - 900) + ' LP';
                  } else if (numericValue >= 1000 && numericValue < 1100) {
                    return 'Silver II ' + (numericValue - 1000) + ' LP';
                  } else if (numericValue >= 1100 && numericValue < 1200) {
                    return 'Silver I ' + (numericValue - 1100) + ' LP';
                  }
                } else if (numericValue >= 1200 && numericValue < 1600) {
                  if (numericValue >= 1200 && numericValue < 1300) {
                    return 'Gold IV ' + (numericValue - 1200) + ' LP';
                  } else if (numericValue >= 1300 && numericValue < 1400) {
                    return 'Gold III ' + (numericValue - 1300) + ' LP';
                  } else if (numericValue >= 1400 && numericValue < 1500) {
                    return 'Gold II ' + (numericValue - 1400) + ' LP';
                  } else if (numericValue >= 1500 && numericValue < 1600) {
                    return 'Gold I ' + (numericValue - 1500) + ' LP';
                  }
                } else if (numericValue >= 1600 && numericValue < 2000) {
                  if (numericValue >= 1600 && numericValue < 1700) {
                    return 'Emerald IV ' + (numericValue - 1600) + ' LP';
                  } else if (numericValue >= 1700 && numericValue < 1800) {
                    return 'Emerald III ' + (numericValue - 1700) + ' LP';
                  } else if (numericValue >= 1800 && numericValue < 1900) {
                    return 'Emerald II ' + (numericValue - 1800) + ' LP';
                  } else if (numericValue >= 1900 && numericValue < 2000) {
                    return 'Emerald I ' + (numericValue - 1900) + ' LP';
                  }
                } else if (numericValue >= 2000 && numericValue < 2400) {
                  if (numericValue >= 2000 && numericValue < 2100) {
                    return 'Platinum IV ' + (numericValue - 2000) + ' LP';
                  } else if (numericValue >= 2100 && numericValue < 2200) {
                    return 'Platinum III ' + (numericValue - 2100) + ' LP';
                  } else if (numericValue >= 2200 && numericValue < 2300) {
                    return 'Platinum II ' + (numericValue - 2200) + ' LP';
                  } else if (numericValue >= 2300 && numericValue < 2400) {
                    return 'Platinum I ' + (numericValue - 2300) + ' LP';
                  }
                } else if (numericValue >= 2400 && numericValue < 2800) {
                  if (numericValue >= 2400 && numericValue < 2500) {
                    return 'Diamond IV ' + (numericValue - 2400) + ' LP';
                  } else if (numericValue >= 2500 && numericValue < 2600) {
                    return 'Diamond III ' + (numericValue - 2500) + ' LP';
                  } else if (numericValue >= 2600 && numericValue < 2700) {
                    return 'Diamond II ' + (numericValue - 2600) + ' LP';
                  } else if (numericValue >= 2700 && numericValue < 2800) {
                    return 'Diamond I ' + (numericValue - 2700) + ' LP';
                  }
                } else if (numericValue >= 2800 && numericValue < 3200) {
                  if (numericValue >= 2800 && numericValue < 2900) {
                    return 'Master IV ' + (numericValue - 2800) + ' LP';
                  } else if (numericValue >= 2900 && numericValue < 3000) {
                    return 'Master III ' + (numericValue - 2900) + ' LP';
                  } else if (numericValue >= 3000 && numericValue < 3100) {
                    return 'Master II ' + (numericValue - 3000) + ' LP';
                  } else if (numericValue >= 3100 && numericValue < 3200) {
                    return 'Master I ' + (numericValue - 3100) + ' LP';
                  }
                } else {
                  return 'Challenger';
                }

                return 'Challenger';
              },
            },
          },
        },
      },
    });
  }

  generateDisplayValue(tickValue: string) {
    let numericValue = parseInt(tickValue);

    if (numericValue < 400) {
      if (numericValue <= 99) {
        return 'Iron IV';
      } else if (numericValue >= 100 && numericValue < 200) {
        return 'Iron III';
      } else if (numericValue >= 200 && numericValue < 300) {
        return 'Iron II';
      } else if (numericValue >= 300 && numericValue < 400) {
        return 'Iron I';
      }
    } else if (numericValue >= 400 && numericValue < 800) {
      if (numericValue >= 400 && numericValue < 500) {
        return 'Bronze IV';
      } else if (numericValue >= 500 && numericValue < 600) {
        return 'Bronze III';
      } else if (numericValue >= 600 && numericValue < 700) {
        return 'Bronze II';
      } else if (numericValue >= 700 && numericValue < 800) {
        return 'Bronze I';
      }
    } else if (numericValue >= 800 && numericValue < 1200) {
      if (numericValue >= 800 && numericValue < 900) {
        return 'Silver IV';
      } else if (numericValue >= 900 && numericValue < 1000) {
        return 'Silver III';
      } else if (numericValue >= 1000 && numericValue < 1100) {
        return 'Silver II';
      } else if (numericValue >= 1100 && numericValue < 1200) {
        return 'Silver I';
      }
    } else if (numericValue >= 1200 && numericValue < 1600) {
      if (numericValue >= 1200 && numericValue < 1300) {
        return 'Gold IV';
      } else if (numericValue >= 1300 && numericValue < 1400) {
        return 'Gold III';
      } else if (numericValue >= 1400 && numericValue < 1500) {
        return 'Gold II';
      } else if (numericValue >= 1500 && numericValue < 1600) {
        return 'Gold I';
      }
    } else if (numericValue >= 1600 && numericValue < 2000) {
      if (numericValue >= 1600 && numericValue < 1700) {
        return 'Emerald IV';
      } else if (numericValue >= 1700 && numericValue < 1800) {
        return 'Emerald III';
      } else if (numericValue >= 1800 && numericValue < 1900) {
        return 'Emerald II';
      } else if (numericValue >= 1900 && numericValue < 2000) {
        return 'Emerald I';
      }
    } else if (numericValue >= 2000 && numericValue < 2400) {
      if (numericValue >= 2000 && numericValue < 2100) {
        return 'Platinum IV';
      } else if (numericValue >= 2100 && numericValue < 2200) {
        return 'Platinum III';
      } else if (numericValue >= 2200 && numericValue < 2300) {
        return 'Platinum II';
      } else if (numericValue >= 2300 && numericValue < 2400) {
        return 'Platinum I';
      }
    } else if (numericValue >= 2400 && numericValue < 2800) {
      if (numericValue >= 2400 && numericValue < 2500) {
        return 'Diamond IV';
      } else if (numericValue >= 2500 && numericValue < 2600) {
        return 'Diamond III';
      } else if (numericValue >= 2600 && numericValue < 2700) {
        return 'Diamond II';
      } else if (numericValue >= 2700 && numericValue < 2800) {
        return 'Diamond I';
      }
    } else if (numericValue >= 2800 && numericValue < 3200) {
      if (numericValue >= 2800 && numericValue < 2900) {
        return 'Master IV';
      } else if (numericValue >= 2900 && numericValue < 3000) {
        return 'Master III';
      } else if (numericValue >= 3000 && numericValue < 3100) {
        return 'Master II';
      } else if (numericValue >= 3100 && numericValue < 3200) {
        return 'Master I';
      }
    } else {
      return 'Challenger';
    }

    return 'Challenger';
  }
}
