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

    let fiveLabels: string[] = [];
    let fiveValues: string[] = [];

    let datasets = [];

    if (soloRankedHistory.length != 0) {
      datasets.push({
        label: 'Solo 5v5',
        data: fiveValues,
        backgroundColor: '#73C3E9',
      });
    }

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
