import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FifaGamePlayed } from "src/app/shared/classes/FifaGamePlayed";
import { PlatformStats } from "src/app/shared/classes/PlatformStats";
import { Player } from "src/app/shared/classes/Player";
import { YuGamesGameService } from "src/app/shared/services/yugames-game.service";
import { YuGamesPlayerService } from "src/app/shared/services/yugames-player.service";

@Component({
  selector: "app-player-details",
  templateUrl: "./player-details.component.html",
  styleUrls: ["./player-details.component.scss"],
})
export class PlayerDetailsComponent implements OnInit {
  playerId: any;
  player: any = null;
  enemy: Player = new Player();
  selectedEnemy = 0;
  players: Player[] = [];
  totalStats: any = null;
  totalEnemyStats: any = null;

  loading = true;
  stats: PlatformStats[] = [];
  enemyStats: PlatformStats[] = [];
  games: FifaGamePlayed[] = [];
  externalIcon = faExternalLinkAlt;

  constructor(
    private route: ActivatedRoute,
    private playerService: YuGamesPlayerService,
    private gameService: YuGamesGameService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.playerId = this.route.snapshot.paramMap.get("id");
    this.getPlayer(this.playerId);
    this.getPlayers();
  }

  getPlayer(id: number) {
    this.loading = true;
    this.playerService.get(id).subscribe(
      (data) => {
        // Getting stats
        this.playerService.getStats(id).subscribe(
          (data2) => {
            let totalStats = new PlatformStats();

            let avgGoalsGiven: number[] = [];
            let avgGoalsTaken: number[] = [];

            this.stats = data2;

            this.stats.forEach((stat) => {
              let gamesPlayed = stat.wins + stat.losses + stat.draws;
              stat.winRate = parseFloat(
                ((stat.wins * 100) / gamesPlayed).toFixed(2)
              );
              stat.looseRate = parseFloat(
                ((stat.losses * 100) / gamesPlayed).toFixed(2)
              );
              stat.drawRate = parseFloat(
                ((stat.draws * 100) / gamesPlayed).toFixed(2)
              );

              totalStats.wins += stat.wins;
              totalStats.losses += stat.losses;
              totalStats.draws += stat.draws;
              totalStats.goalDifference += stat.goalDifference;
              avgGoalsGiven.push(stat.averageGoalGiven);
              avgGoalsTaken.push(stat.averageGoalTaken);
            });

            let totalGamePlayed =
              totalStats.wins + totalStats.losses + totalStats.draws;

            totalStats.winRate = parseFloat(
              ((totalStats.wins * 100) / totalGamePlayed).toFixed(2)
            );
            totalStats.looseRate = parseFloat(
              ((totalStats.losses * 100) / totalGamePlayed).toFixed(2)
            );
            totalStats.drawRate = parseFloat(
              ((totalStats.draws * 100) / totalGamePlayed).toFixed(2)
            );
            totalStats.averageGoalGiven = parseFloat(
              (
                avgGoalsGiven.reduce((a, b) => a + b, 0) / avgGoalsGiven.length
              ).toFixed(2)
            );
            totalStats.averageGoalTaken = parseFloat(
              (
                avgGoalsTaken.reduce((a, b) => a + b, 0) / avgGoalsTaken.length
              ).toFixed(2)
            );

            this.totalStats = totalStats;

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
    this.enemyStats.length = 0;

    if (newValue.value != "0") {
      this.loading = true;

      this.playerService.get(newValue.value).subscribe(
        (data) => {
          this.enemy = data;
          // Getting stats
          this.playerService.getStats(newValue.value).subscribe(
            (data2) => {
              let totalStats = new PlatformStats();

              let avgGoalsGiven: number[] = [];
              let avgGoalsTaken: number[] = [];

              data2.forEach((stat) => {
                let gamesPlayed = stat.wins + stat.losses + stat.draws;
                stat.winRate = parseFloat(
                  ((stat.wins * 100) / gamesPlayed).toFixed(2)
                );
                stat.looseRate = parseFloat(
                  ((stat.losses * 100) / gamesPlayed).toFixed(2)
                );
                stat.drawRate = parseFloat(
                  ((stat.draws * 100) / gamesPlayed).toFixed(2)
                );

                totalStats.wins += stat.wins;
                totalStats.losses += stat.losses;
                totalStats.draws += stat.draws;
                totalStats.goalDifference += stat.goalDifference;
                avgGoalsGiven.push(stat.averageGoalGiven);
                avgGoalsTaken.push(stat.averageGoalTaken);
              });

              let totalGamePlayed =
                totalStats.wins + totalStats.losses + totalStats.draws;

              totalStats.winRate = parseFloat(
                ((totalStats.wins * 100) / totalGamePlayed).toFixed(2)
              );
              totalStats.looseRate = parseFloat(
                ((totalStats.losses * 100) / totalGamePlayed).toFixed(2)
              );
              totalStats.drawRate = parseFloat(
                ((totalStats.draws * 100) / totalGamePlayed).toFixed(2)
              );
              totalStats.averageGoalGiven = parseFloat(
                (
                  avgGoalsGiven.reduce((a, b) => a + b, 0) /
                  avgGoalsGiven.length
                ).toFixed(2)
              );
              totalStats.averageGoalTaken = parseFloat(
                (
                  avgGoalsTaken.reduce((a, b) => a + b, 0) /
                  avgGoalsTaken.length
                ).toFixed(2)
              );

              this.totalEnemyStats = totalStats;
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
}
