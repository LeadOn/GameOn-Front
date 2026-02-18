import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCalendar, faSync } from '@fortawesome/free-solid-svg-icons';
import { Chart } from 'chart.js/auto';
import { LoLGame } from '../../../../shared/classes/lol/LoLGame';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import { GameOnLoLService } from '../../../../shared/services/leagueoflegends/gameon-lol.service';

@Component({
  selector: 'app-lol-game-details',
  templateUrl: './lol-game-details.component.html',
  styleUrl: './lol-game-details.component.css',
  standalone: false,
})
export class LolGameDetailsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('kdaComparisonChart')
  kdaComparisonChartCanvas?: ElementRef<HTMLCanvasElement>;

  @ViewChild('damageComparisonChart')
  damageComparisonChartCanvas?: ElementRef<HTMLCanvasElement>;

  @ViewChild('economyComparisonChart')
  economyComparisonChartCanvas?: ElementRef<HTMLCanvasElement>;

  kdaChart?: Chart;
  damageChart?: Chart;
  economyChart?: Chart;

  gameId: any;
  playerId: any;

  game: LoLGame = new LoLGame();
  team1: LoLGameParticipant[] = [];
  team2: LoLGameParticipant[] = [];

  timeline?: LoLGameTimelineFrame[];
  selectedComparisonFilter: 'all' | 'team1' | 'team2' = 'all';

  patchTitle = 'Patch inconnu';

  refreshIcon = faSync;
  calendarIcon = faCalendar;

  isLoading = true;
  gameError = false;

  constructor(
    private route: ActivatedRoute,
    private lolService: GameOnLoLService,
  ) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.playerId = this.route.snapshot.paramMap.get('playerId');

    this.loadGame();
  }

  ngAfterViewInit(): void {
    this.rebuildComparisonCharts();
  }

  ngOnDestroy(): void {
    this.destroyComparisonCharts();
  }

  loadGame() {
    this.isLoading = true;
    this.lolService.getGame(this.gameId).subscribe(
      (game) => {
        this.game = game;

        if (this.game.gameVersion) {
          this.patchTitle = `Patch ${this.game.gameVersion}`;
        }

        let teams = game.leagueOfLegendsGameParticipants.reduce(
          (acc: { [teamId: number]: LoLGameParticipant[] }, player) => {
            if (!acc[player.teamId]) {
              acc[player.teamId] = [];
            }
            acc[player.teamId].push(player);
            return acc;
          },
          {},
        );

        let keys = Object.keys(teams);
        if (keys.length == 2) {
          keys.forEach((key) => {
            if (keys.indexOf(key) == 0) {
              this.team1 = teams[100];
            } else {
              this.team2 = teams[200];
            }
          });
        }

        this.scheduleComparisonChartsRebuild();

        this.getTimeline();
      },
      (err) => {
        this.gameError = true;
        console.error(err);
      },
    );
  }

  updateGame(): void {
    this.isLoading = true;
    this.lolService.refreshGame(this.gameId).subscribe(
      (x) => {
        this.loadGame();
      },
      (err) => {
        this.gameError = true;
        console.error(err);
      },
    );
  }

  getTimeline() {
    this.lolService.getGameTimeline(this.gameId).subscribe(
      (timeline) => {
        this.timeline = timeline;
        this.isLoading = false;
        this.scheduleComparisonChartsRebuild();
      },
      (err) => {
        this.gameError = true;
        console.error(err);
      },
    );
  }

  setComparisonFilter(filter: 'all' | 'team1' | 'team2') {
    this.selectedComparisonFilter = filter;
    this.scheduleComparisonChartsRebuild();
  }

  private scheduleComparisonChartsRebuild() {
    setTimeout(() => {
      this.rebuildComparisonCharts();
    }, 0);
  }

  private rebuildComparisonCharts() {
    this.destroyComparisonCharts();
    this.buildComparisonCharts();
  }

  private destroyComparisonCharts() {
    this.kdaChart?.destroy();
    this.damageChart?.destroy();
    this.economyChart?.destroy();
    this.kdaChart = undefined;
    this.damageChart = undefined;
    this.economyChart = undefined;
  }

  private buildComparisonCharts() {
    if (
      this.kdaComparisonChartCanvas == null ||
      this.damageComparisonChartCanvas == null ||
      this.economyComparisonChartCanvas == null
    ) {
      return;
    }

    const allPlayers = [...this.team1, ...this.team2];
    if (allPlayers.length == 0) {
      return;
    }

    const filteredPlayers =
      this.selectedComparisonFilter == 'team1'
        ? this.team1
        : this.selectedComparisonFilter == 'team2'
          ? this.team2
          : allPlayers;

    if (filteredPlayers.length == 0) {
      return;
    }

    const latestFrame = this.timeline
      ?.slice()
      .sort((a, b) => a.timestamp - b.timestamp)
      .at(-1);

    const finalStatsByPuuid = new Map<string, any>();
    latestFrame?.loLGameTimelineFrameParticipants?.forEach((participant) => {
      finalStatsByPuuid.set(participant.participantPUUID, participant);
    });

    const labels = filteredPlayers.map(
      (player, index) => player.riotIdGameName || `Joueur ${index + 1}`,
    );

    const teamColors = filteredPlayers.map((player) =>
      player.teamId == 100
        ? 'rgba(37, 99, 235, 0.7)'
        : 'rgba(220, 38, 38, 0.7)',
    );

    const kills = filteredPlayers.map((player) => player.kills || 0);
    const deaths = filteredPlayers.map((player) => player.deaths || 0);
    const assists = filteredPlayers.map((player) => player.assists || 0);

    const totalDamageToChampions = filteredPlayers.map((player) => {
      const stats = finalStatsByPuuid.get(player.puuid || '');
      return stats?.totalDamageDoneToChampions || 0;
    });

    const totalDamageTaken = filteredPlayers.map((player) => {
      const stats = finalStatsByPuuid.get(player.puuid || '');
      return stats?.totalDamageTaken || 0;
    });

    const totalGold = filteredPlayers.map((player) => {
      const stats = finalStatsByPuuid.get(player.puuid || '');
      return stats?.totalGold || 0;
    });

    const totalCs = filteredPlayers.map((player) => {
      const stats = finalStatsByPuuid.get(player.puuid || '');
      const laneCs = stats?.minionsKilled || 0;
      const jungleCs = stats?.jungleMinionsKilled || 0;
      return laneCs + jungleCs;
    });

    const gridColor = 'rgba(255, 255, 255, 0.08)';
    const tickColor = 'rgba(226, 232, 240, 0.85)';

    this.kdaChart = new Chart(this.kdaComparisonChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Kills',
            data: kills,
            backgroundColor: 'rgba(56, 189, 248, 0.8)',
            borderRadius: 4,
          },
          {
            label: 'Deaths',
            data: deaths,
            backgroundColor: 'rgba(244, 63, 94, 0.8)',
            borderRadius: 4,
          },
          {
            label: 'Assists',
            data: assists,
            backgroundColor: 'rgba(245, 158, 11, 0.8)',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: tickColor,
              font: { size: 10 },
              boxWidth: 14,
              boxHeight: 8,
            },
          },
        },
        scales: {
          x: {
            ticks: { color: tickColor, maxRotation: 45, minRotation: 0 },
            grid: { color: gridColor },
          },
          y: {
            beginAtZero: true,
            ticks: { color: tickColor },
            grid: { color: gridColor },
          },
        },
      },
    });

    this.damageChart = new Chart(
      this.damageComparisonChartCanvas.nativeElement,
      {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Dégâts aux champions',
              data: totalDamageToChampions,
              backgroundColor: teamColors,
              borderRadius: 4,
            },
            {
              label: 'Dégâts reçus',
              data: totalDamageTaken,
              backgroundColor: 'rgba(148, 163, 184, 0.7)',
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: tickColor,
                font: { size: 10 },
                boxWidth: 14,
                boxHeight: 8,
              },
            },
          },
          scales: {
            x: {
              ticks: { color: tickColor, maxRotation: 45, minRotation: 0 },
              grid: { color: gridColor },
            },
            y: {
              beginAtZero: true,
              ticks: { color: tickColor },
              grid: { color: gridColor },
            },
          },
        },
      },
    );

    this.economyChart = new Chart(
      this.economyComparisonChartCanvas.nativeElement,
      {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Total Gold',
              data: totalGold,
              backgroundColor: teamColors,
              borderRadius: 4,
              yAxisID: 'y',
            },
            {
              label: 'Total CS',
              data: totalCs,
              backgroundColor: 'rgba(45, 212, 191, 0.8)',
              borderRadius: 4,
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: tickColor,
                font: { size: 10 },
                boxWidth: 14,
                boxHeight: 8,
              },
            },
          },
          scales: {
            x: {
              ticks: { color: tickColor, maxRotation: 45, minRotation: 0 },
              grid: { color: gridColor },
            },
            y: {
              beginAtZero: true,
              position: 'left',
              ticks: { color: tickColor },
              grid: { color: gridColor },
            },
            y1: {
              beginAtZero: true,
              position: 'right',
              ticks: { color: tickColor },
              grid: { drawOnChartArea: false },
            },
          },
        },
      },
    );
  }
}
