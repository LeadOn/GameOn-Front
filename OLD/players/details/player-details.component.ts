import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

import {faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
import {FifaGamePlayed} from "src/app/shared/classes/FifaGamePlayed";
import {FifaPlayerStatsDto} from "src/app/shared/classes/FifaPlayerStatsDto";
import {PlatformStatsDto} from "src/app/shared/classes/PlatformStatsDto";
import {Player} from "src/app/shared/classes/Player";
import {GameOnGameService} from "src/app/shared/services/gameon-game.service";
import {GameOnPlayerService} from "src/app/shared/services/gameon-player.service";
import {trigger, style, animate, transition} from "@angular/animations";
import {GameOnSeasonService} from "src/app/shared/services/gameon-season.service";
import {Season} from "src/app/shared/classes/Season";

@Component({
  selector: "app-player-details",
  templateUrl: "./player-details.component.html",
  styleUrls: ["./player-details.component.scss"],
  animations: [
    trigger("inOutAnimation", [
      transition(":enter", [
        style({opacity: 0}),
        animate(200, style({opacity: 1})),
      ]),
      transition(":leave", [
        style({opacity: 1}),
        animate(200, style({opacity: 0})),
      ]),
    ]),
  ],
})
export class PlayerDetailsComponent implements OnInit {
  selectedStats = 0;
  selectedEnemy = 0;
  selectedSeason = 0;
  calculatedStats = new PlatformStatsDto();
  loading = true;
  externalIcon = faExternalLinkAlt;

  playerId: any;
  fifaPlayerStats?: FifaPlayerStatsDto;
  player?: Player;
  enemy?: Player;
  enemyStats?: FifaPlayerStatsDto;
  players: Player[] = [];
  games: FifaGamePlayed[] = [];

  seasons?: Season[];

  constructor(
    private route: ActivatedRoute,
    private playerService: GameOnPlayerService,
    private gameService: GameOnGameService,
    private seasonService: GameOnSeasonService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.playerId = this.route.snapshot.paramMap.get("id");
    this.getPlayer(this.playerId);
    this.getPlayers();
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
                      "Erreur lors de la récupération des dernières parties jouées."
                    );
                    console.error(err);
                  }
                );
              },
              (err) => {
                alert(
                  "Une erreur est survenue lors de la récupération des statistiques de l'utilisateur."
                );
                console.error(err);
              }
            );
          },
          (err) => {
            alert(
              "Une erreur est survenue lors de la récupération des saisons."
            );
            console.error(err);
          }
        );
      },
      (err) => {
        alert(
          "Une erreur est survenue lors de la récupération du profil de l'utilisateur."
        );
        console.error(err);
      }
    );
  }

  getPlayers() {
    this.loading = true;
    this.playerService.getAll().subscribe(
      (data) => {
        data.forEach((player) => {
          if (player.id != this.playerId) {
            this.players.push(player);
          }
        });

        this.loading = false;
      },
      (err) => {
        alert(
          "Une erreur est survenue lors de la récupération de la liste des utilisateurs."
        );
        console.error(err);
      }
    );
  }

  onChangeEnemy(newValue: any) {
    this.selectedEnemy = parseInt(newValue.value);
    this.enemyStats = undefined;

    if (newValue.value != "0") {
      this.loading = true;

      this.playerService.get(newValue.value).subscribe(
        (data) => {
          this.enemy = data;
          // Getting stats
          this.playerService
            .getStats(newValue.value, this.selectedSeason)
            .subscribe(
              (data2) => {
                this.enemyStats = data2;
                this.loading = false;
              },
              (err) => {
                alert(
                  "Une erreur est survenue lors de la récupération des statistiques de l'adversaire."
                );
                console.error(err);
              }
            );
        },
        (err) => {
          alert(
            "Une erreur est survenue lors de la récupération du profil de l'adversaire."
          );
          console.error(err);
        }
      );
    }
  }

  onChangeSeason(newValue: any) {
    this.selectedSeason = parseInt(newValue.value);

    if (newValue.value != "0") {
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
            "Une erreur est survenue lors de la récupération des statistiques de la saison."
          );
          console.error(err);
        }
      );
    }
  }

  onChangeStats(newValue: any) {
    this.selectedStats = parseInt(newValue.value);

    // Getting stats
    this.calculateStats();
  }
}
