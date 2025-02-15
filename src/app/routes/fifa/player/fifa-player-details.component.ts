import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  faArrowRight,
  faExternalLinkAlt,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { PlatformStatsDto } from '../../../shared/classes/common/PlatformStatsDto';
import { FifaPlayerStatsDto } from '../../../shared/classes/fifa/FifaPlayerStatsDto';
import { Player } from '../../../shared/classes/common/Player';
import { FifaGamePlayed } from '../../../shared/classes/fifa/FifaGamePlayed';
import { Season } from '../../../shared/classes/fifa/Season';
import { GameOnPlayerService } from '../../../shared/services/common/gameon-player.service';
import { GameOnGameService } from '../../../shared/services/fifa/gameon-game.service';
import { GameOnSeasonService } from '../../../shared/services/fifa/gameon-season.service';
@Component({
  selector: 'app-fifa-player-details',
  templateUrl: './fifa-player-details.component.html',
  styleUrls: ['./fifa-player-details.component.css'],
  standalone: false,
})
export class FifaPlayerDetailsComponent implements OnInit {
  selectedStats = 0;
  selectedEnemy = 0;
  selectedSeason = 0;
  calculatedStats = new PlatformStatsDto();
  loading = true;
  externalIcon = faExternalLinkAlt;
  starIcon = faStar;
  rightArrowIcon = faArrowRight;

  playerId: any;
  fifaPlayerStats?: FifaPlayerStatsDto;
  player?: Player;
  games: FifaGamePlayed[] = [];

  seasons?: Season[];

  constructor(
    private route: ActivatedRoute,
    private playerService: GameOnPlayerService,
    private gameService: GameOnGameService,
    private seasonService: GameOnSeasonService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.playerId = this.route.snapshot.paramMap.get('id');
    this.getPlayer(this.playerId);
  }

  calculateStats() {
    if (this.selectedStats == 0) {
      this.fifaPlayerStats?.statsPerPlatform.forEach((x) => {
        if (x.platform.id == 0) {
          this.calculatedStats = x;
        }
      });
    }

    if (this.selectedStats == 1) {
      this.fifaPlayerStats?.statsPerPlatform.forEach((x) => {
        if (x.platform.id == 1) {
          this.calculatedStats = x;
        }
      });
    }

    if (this.selectedStats == 2) {
      this.fifaPlayerStats?.statsPerPlatform.forEach((x) => {
        if (x.platform.id == 2) {
          this.calculatedStats = x;
        }
      });
    }

    if (this.selectedStats == 3) {
      this.fifaPlayerStats?.statsPerPlatform.forEach((x) => {
        if (x.platform.id == 3) {
          this.calculatedStats = x;
        }
      });
    }
  }

  getPlayer(id: number) {
    this.loading = true;
    this.playerService.get(id).subscribe(
      (data) => {
        this.seasonService.getAll().subscribe(
          (data3) => {
            this.seasons = data3;
            this.selectedSeason = data3[data3.length - 1].id;

            // Getting stats
            this.playerService.getStats(id).subscribe(
              (data2) => {
                this.fifaPlayerStats = data2;
                this.calculatedStats = data2.statsPerPlatform[0];

                // Getting last games played
                this.gameService.getLastByPlayer(id, 20).subscribe(
                  (data3) => {
                    this.games = data3;
                    this.player = data;
                    this.loading = false;
                  },
                  (err) => {
                    alert(
                      'Erreur lors de la récupération des dernières parties jouées.',
                    );
                    console.error(err);
                  },
                );
              },
              (err) => {
                alert(
                  "Une erreur est survenue lors de la récupération des statistiques de l'utilisateur.",
                );
                console.error(err);
              },
            );
          },
          (err) => {
            alert(
              'Une erreur est survenue lors de la récupération des saisons.',
            );
            console.error(err);
          },
        );
      },
      (err) => {
        alert(
          "Une erreur est survenue lors de la récupération du profil de l'utilisateur.",
        );
        console.error(err);
      },
    );
  }

  onChangeSeason(newValue: any) {
    this.selectedSeason = parseInt(newValue.value);

    if (newValue.value != '0') {
      this.loading = true;

      // Getting stats
      this.playerService.getStats(this.playerId, newValue.value).subscribe(
        (data2) => {
          this.fifaPlayerStats = data2;
          this.calculatedStats = data2.statsPerPlatform[0];
          this.loading = false;
        },
        (err) => {
          alert(
            'Une erreur est survenue lors de la récupération des statistiques de la saison.',
          );
          console.error(err);
        },
      );
    }
  }

  onChangeStats(newValue: any) {
    this.selectedStats = parseInt(newValue.value);

    // Getting stats
    this.calculateStats();
  }
}
