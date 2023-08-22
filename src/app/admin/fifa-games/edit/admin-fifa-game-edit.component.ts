import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Platform } from "src/app/shared/classes/Platform";
import { YuGamesPlatformService } from "src/app/shared/services/yugames-platform.service";
import { YuGamesAdminService } from "../../shared/services/yugames-admin.service";
import { FifaGamePlayed } from "src/app/shared/classes/FifaGamePlayed";
import { YuGamesGameService } from "src/app/shared/services/yugames-game.service";
import { FifaTeam } from "src/app/shared/classes/FifaTeam";
import { YuGamesFifaTeamService } from "src/app/shared/services/yugames-fifateam.service";
import { UpdateGame } from "../../shared/classes/UpdateGame";

@Component({
  selector: "app-admin-fifa-game-edit",
  templateUrl: "./admin-fifa-game-edit.component.html",
  styleUrls: ["./admin-fifa-game-edit.component.scss"],
})
export class AdminFifaGameEditComponent implements OnInit {
  gameId: any;
  game: FifaGamePlayed = new FifaGamePlayed();
  platforms: Platform[] = [];
  fifaTeams: FifaTeam[] = [];
  loading = true;

  updateGameForm = new FormGroup({
    teamCode1: new FormControl("", [
      Validators.required,
      Validators.maxLength(5),
    ]),
    teamFifa1: new FormControl(0),
    teamCode2: new FormControl("", [
      Validators.required,
      Validators.maxLength(5),
    ]),
    teamFifa2: new FormControl(0),
    platform: new FormControl(0),
    teamScore1: new FormControl(0, [Validators.min(0)]),
    teamScore2: new FormControl(0, [Validators.min(0)]),
  });

  constructor(
    private route: ActivatedRoute,
    private gameService: YuGamesGameService,
    private platformService: YuGamesPlatformService,
    private fifaTeamService: YuGamesFifaTeamService,
    private adminService: YuGamesAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get("id");
    this.getPlatforms();
  }

  getGame() {
    this.gameService.getById(this.gameId).subscribe(
      (data) => {
        this.game = data;
        this.updateGameForm.controls["teamCode1"].setValue(
          this.game.team1.code.toString()
        );
        this.updateGameForm.controls["teamFifa1"].setValue(
          this.game.team1.fifaTeamId
        );
        this.updateGameForm.controls["teamScore1"].setValue(
          this.game.team1.score
        );
        this.updateGameForm.controls["teamCode2"].setValue(
          this.game.team2.code.toString()
        );
        this.updateGameForm.controls["teamFifa2"].setValue(
          this.game.team2.fifaTeamId
        );
        this.updateGameForm.controls["teamScore2"].setValue(
          this.game.team2.score
        );
        this.updateGameForm.controls["platform"].setValue(this.game.platformId);
        this.loading = false;
      },
      (err) => {
        console.error(err);
        alert("Une erreur est survenue lors de la récupération du match.");
        this.loading = false;
      }
    );
  }

  getPlatforms() {
    this.platformService.getAll().subscribe(
      (data) => {
        this.platforms = data;
        this.getFifaTeams();
      },
      (err) => {
        console.error(err);
        alert(
          "Une erreur est survenue lors de la récupération des plateformes."
        );
      }
    );
  }

  getFifaTeams() {
    this.fifaTeamService.getAll().subscribe(
      (data) => {
        this.fifaTeams = data;
        this.getGame();
      },
      (err) => {
        console.error(err);
        alert(
          "Une erreur est survenue lors de la récupération des plateformes."
        );
      }
    );
  }

  updateGame() {
    let updateGame = new UpdateGame();
    updateGame.Id = this.gameId;

    if (this.updateGameForm.controls["platform"].value != null) {
      updateGame.PlatformId = this.updateGameForm.controls["platform"].value;
    }
    if (
      this.updateGameForm.controls["teamCode1"].value != null &&
      this.updateGameForm.controls["teamCode1"].value != ""
    ) {
      updateGame.TeamCode1 = this.updateGameForm.controls["teamCode1"].value;
    }
    if (this.updateGameForm.controls["teamFifa1"].value != null) {
      updateGame.FifaTeam1 = this.updateGameForm.controls["teamFifa1"].value;
    }
    if (this.updateGameForm.controls["teamScore1"].value != null) {
      updateGame.TeamScore1 = this.updateGameForm.controls["teamScore1"].value;
    }
    if (
      this.updateGameForm.controls["teamCode2"].value != null &&
      this.updateGameForm.controls["teamCode2"].value != ""
    ) {
      updateGame.TeamCode2 = this.updateGameForm.controls["teamCode2"].value;
    }
    if (this.updateGameForm.controls["teamFifa2"].value != null) {
      updateGame.FifaTeam2 = this.updateGameForm.controls["teamFifa2"].value;
    }
    if (this.updateGameForm.controls["teamScore2"].value != null) {
      updateGame.TeamScore2 = this.updateGameForm.controls["teamScore2"].value;
    }

    if (
      updateGame.Id != 0 &&
      updateGame.TeamCode1 != null &&
      updateGame.TeamCode1 != "" &&
      updateGame.TeamCode2 != null &&
      updateGame.TeamCode2 != "" &&
      updateGame.FifaTeam1 != 0 &&
      updateGame.FifaTeam2 != 0 &&
      this.loading == false
    ) {
      this.loading = true;
      this.adminService.updateGame(updateGame).subscribe(
        (data) => {
          alert("Match mis à jour !");
          this.loading = false;
          this.router.navigate(["/admin/fifa-games"]);
        },
        (err) => {
          alert("Erreur lors de la mise à jour du match ! Erreur : " + err);
          this.loading = false;
        }
      );
    } else {
      alert("Certaines informations sont manquantes !");
    }
  }
}
