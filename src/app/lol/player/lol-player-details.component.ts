import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameOnPlayerService } from '../../shared/services/gameon-player.service';
import { PlayerDto } from '../../shared/classes/PlayerDto';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { Chart } from 'chart.js/auto';
import { tick } from '@angular/core/testing';
import { LeagueOfLegendsRankHistory } from '../../shared/classes/LeagueOfLegendsRankHistory';

@Component({
  selector: 'app-lol-player-details',
  templateUrl: './lol-player-details.component.html',
  styleUrl: './lol-player-details.component.scss',
})
export class LolPlayerDetailsComponent implements OnInit {
  playerId: any;
  loading = true;
  player?: PlayerDto;
  refreshIcon = faSync;
  rankHistory: LeagueOfLegendsRankHistory[] = [];

  chart: any;

  constructor(
    private route: ActivatedRoute,
    private playerService: GameOnPlayerService
  ) {}

  ngOnInit(): void {
    this.playerId = this.route.snapshot.paramMap.get('id');
    this.getSummoner();
  }

  getSummoner() {
    this.playerService.getSummoner(this.playerId).subscribe(
      (player) => {
        this.player = player;
        this.getRankHistory();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getRankHistory() {
    this.playerService.getLolRankHistory(this.playerId, 25).subscribe(
      (data) => {
        this.rankHistory = data;

        this.loading = false;

        if (this.rankHistory.length != 0) {
          this.buildChart();
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  buildChart() {
    let soloRankedHistory = this.rankHistory.filter(
      (history) => history.queueType === 'RANKED_SOLO_5x5'
    );

    let flexRankedHistory = this.rankHistory.filter(
      (history) => history.queueType === 'RANKED_FLEX_SR'
    );

    let fiveLabels: string[] = [];
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

    if (soloRankedHistory.length != 0) {
      datasets.push({
        label: 'Solo 5v5',
        data: fiveValues,
        backgroundColor: '#73C3E9',
      });
    }

    if (flexRankedHistory.length != 0) {
      datasets.push({
        label: 'Flex 5v5',
        data: flexValues,
        backgroundColor: '#59958c',
      });
    }

    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        // values on X-Axis
        labels: fiveLabels,
        datasets: datasets,
      },
      options: {
        aspectRatio: 2,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              maxTicksLimit: 5,
              callback: (tickValue, index) => {
                let numericValue = parseInt(tickValue.toString());

                if (numericValue < 400) {
                  if (numericValue <= 100) {
                    return 'Iron IV - ' + numericValue + ' LP';
                  } else if (numericValue > 100 && numericValue <= 200) {
                    return 'Iron III - ' + (numericValue - 100) + ' LP';
                  } else if (numericValue > 200 && numericValue <= 300) {
                    return 'Iron II - ' + (numericValue - 200) + ' LP';
                  } else if (numericValue > 300 && numericValue <= 400) {
                    return 'Iron I - ' + (numericValue - 300) + ' LP';
                  }
                } else if (numericValue >= 400 && numericValue < 800) {
                  if (numericValue >= 400 && numericValue <= 500) {
                    return 'Bronze IV - ' + (numericValue - 400) + ' LP';
                  } else if (numericValue > 500 && numericValue <= 600) {
                    return 'Bronze III - ' + (numericValue - 600) + ' LP';
                  } else if (numericValue > 600 && numericValue <= 700) {
                    return 'Bronze II - ' + (numericValue - 700) + ' LP';
                  } else if (numericValue > 700 && numericValue <= 800) {
                    return 'Bronze I - ' + (numericValue - 800) + ' LP';
                  }
                } else if (numericValue >= 800 && numericValue < 1200) {
                  if (numericValue >= 800 && numericValue <= 900) {
                    return 'Silver IV - ' + (numericValue - 800) + ' LP';
                  } else if (numericValue > 900 && numericValue <= 1000) {
                    return 'Silver III - ' + (numericValue - 1000) + ' LP';
                  } else if (numericValue > 1000 && numericValue <= 1100) {
                    return 'Silver II - ' + (numericValue - 1100) + ' LP';
                  } else if (numericValue > 1100 && numericValue <= 1200) {
                    return 'Silver I - ' + (numericValue - 1200) + ' LP';
                  }
                } else if (numericValue >= 1200 && numericValue < 1600) {
                  if (numericValue >= 1200 && numericValue <= 1300) {
                    return 'Gold IV - ' + (numericValue - 1200) + ' LP';
                  } else if (numericValue > 1300 && numericValue <= 1400) {
                    return 'Gold III - ' + (numericValue - 1400) + ' LP';
                  } else if (numericValue > 1400 && numericValue <= 1500) {
                    return 'Gold II - ' + (numericValue - 1500) + ' LP';
                  } else if (numericValue > 1500 && numericValue <= 1600) {
                    return 'Gold I - ' + (numericValue - 1600) + ' LP';
                  }
                } else if (numericValue >= 1600 && numericValue < 2000) {
                  if (numericValue >= 1600 && numericValue <= 1700) {
                    return 'Emerald IV - ' + (numericValue - 1600) + ' LP';
                  } else if (numericValue > 1700 && numericValue <= 1800) {
                    return 'Emerald III - ' + (numericValue - 1800) + ' LP';
                  } else if (numericValue > 1800 && numericValue <= 1900) {
                    return 'Emerald II - ' + (numericValue - 1900) + ' LP';
                  } else if (numericValue > 1900 && numericValue <= 2000) {
                    return 'Emerald I - ' + (numericValue - 2000) + ' LP';
                  }
                } else if (numericValue >= 2000 && numericValue < 2400) {
                  if (numericValue >= 2000 && numericValue <= 2100) {
                    return 'Platinum IV - ' + (numericValue - 2000) + ' LP';
                  } else if (numericValue > 2100 && numericValue <= 2200) {
                    return 'Platinum III - ' + (numericValue - 2200) + ' LP';
                  } else if (numericValue > 2200 && numericValue <= 2300) {
                    return 'Platinum II - ' + (numericValue - 2300) + ' LP';
                  } else if (numericValue > 2300 && numericValue <= 2400) {
                    return 'Platinum I - ' + (numericValue - 2400) + ' LP';
                  }
                } else if (numericValue >= 2400 && numericValue < 2800) {
                  if (numericValue >= 2400 && numericValue <= 2500) {
                    return 'Diamond IV - ' + (numericValue - 2400) + ' LP';
                  } else if (numericValue > 2500 && numericValue <= 2600) {
                    return 'Diamond III - ' + (numericValue - 2600) + ' LP';
                  } else if (numericValue > 2600 && numericValue <= 2700) {
                    return 'Diamond II - ' + (numericValue - 2700) + ' LP';
                  } else if (numericValue > 2700 && numericValue <= 2800) {
                    return 'Diamond I - ' + (numericValue - 2800) + ' LP';
                  }
                } else if (numericValue >= 2800 && numericValue < 3200) {
                  if (numericValue >= 2800 && numericValue <= 2900) {
                    return 'Master IV - ' + (numericValue - 2800) + ' LP';
                  } else if (numericValue > 2900 && numericValue <= 3000) {
                    return 'Master III - ' + (numericValue - 3000) + ' LP';
                  } else if (numericValue > 3000 && numericValue <= 3100) {
                    return 'Master II - ' + (numericValue - 3100) + ' LP';
                  } else if (numericValue > 3100 && numericValue <= 3200) {
                    return 'Master I - ' + (numericValue - 3200) + ' LP';
                  }
                } else {
                  return 'Challenger - ' + (numericValue - 3200) + ' LP';
                }

                return tickValue + ' LP';
              },
            },
          },
        },
      },
    });
  }

  refreshSummoner() {
    this.chart.destroy();
    this.loading = true;
    this.playerService.refreshSummonerById(this.playerId).subscribe(
      (data) => {
        this.getSummoner();
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
