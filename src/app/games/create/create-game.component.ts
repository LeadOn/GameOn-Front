import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FifaTeam } from "src/app/shared/classes/FifaTeam";
import { Platform } from "src/app/shared/classes/Platform";
import { Player } from "src/app/shared/classes/Player";
import { YuFootFifaTeamService } from "src/app/shared/services/yufoot-fifateam.service";
import { YuFootGameService } from "src/app/shared/services/yufoot-game.service";
import { YuFootPlatformService } from "src/app/shared/services/yufoot-platform.service";
import { YuFootPlayerService } from "src/app/shared/services/yufoot-player.service";

@Component({
  selector: "app-create-game",
  templateUrl: "./create-game.component.html",
  styleUrls: ["./create-game.component.scss"],
})
export class CreateGameComponent implements OnInit {
  isLoading = true;
  players: Player[] = [];
  platforms: Platform[] = [];
  fifaTeams: FifaTeam[] = [];

  createGameForm = new FormGroup({
    teamCode1: new FormControl("", [
      Validators.required,
      Validators.maxLength(5),
    ]),
    teamFifa1: new FormControl(0),
    teamScore1: new FormControl(0, [Validators.required, Validators.min(0)]),
    teamCode2: new FormControl("", [
      Validators.required,
      Validators.maxLength(5),
    ]),
    teamFifa2: new FormControl(0),
    teamScore2: new FormControl(0, [Validators.required, Validators.min(0)]),
    platform: new FormControl("", Validators.required),
    team1: new FormControl([], Validators.required),
    team2: new FormControl([], Validators.required),
    date: new FormControl("", Validators.required),
  });

  constructor(
    private playerService: YuFootPlayerService,
    private platformService: YuFootPlatformService,
    private gameService: YuFootGameService,
    private fifaTeamService: YuFootFifaTeamService
  ) {}

  ngOnInit(): void {
    this.playerService.getAll().subscribe((data) => {
      this.players = data;
      this.platformService.getAll().subscribe((data2) => {
        this.platforms = data2;
        this.createGameForm.controls["platform"].setValue(
          data2[0].id.toString()
        );

        this.fifaTeamService.getAll().subscribe((data3) => {
          this.fifaTeams = data3;

          this.isLoading = false;
        });
      });
    });
  }

  createGame() {
    this.isLoading = true;
    let body = {
      TeamCode1: this.createGameForm.controls["teamCode1"].value,
      TeamScore1: this.createGameForm.controls["teamScore1"].value,
      TeamCode2: this.createGameForm.controls["teamCode2"].value,
      TeamScore2: this.createGameForm.controls["teamScore2"].value,
      PlatformId: this.createGameForm.controls["platform"].value,
      Team1: this.createGameForm.controls["team1"].value,
      Team2: this.createGameForm.controls["team2"].value,
      FifaTeam1: 0,
      FifaTeam2: 0,
      CreatedOn: formatDate(new Date(), "yyyy-MM-ddTHH:mm:ss", "en-US"),
    };

    let fifaTeam1 = this.createGameForm.controls["teamFifa1"].value;
    if (fifaTeam1 != null && fifaTeam1 != 0) {
      body.FifaTeam1 = fifaTeam1;
    }
    let fifaTeam2 = this.createGameForm.controls["teamFifa2"].value;
    if (fifaTeam2 != null && fifaTeam2 != 0) {
      body.FifaTeam2 = fifaTeam2;
    }

    if (
      body.TeamCode1 != null &&
      body.TeamCode1 != "" &&
      body.TeamScore1 != null &&
      body.TeamCode2 != null &&
      body.TeamCode2 != "" &&
      body.TeamScore2 != null &&
      body.PlatformId != null &&
      body.Team1 != null &&
      body.Team1.length > 0 &&
      body.Team2 != null &&
      body.Team2.length > 0 &&
      body.CreatedOn != null
    ) {
      this.gameService.create(body).subscribe(
        (data) => {
          alert("Match créé !");
          this.isLoading = false;
        },
        (err) => {
          alert("Erreur lors de la création du match ! Erreur : " + err);
          this.isLoading = false;
        }
      );
    } else {
      alert("Certaines informations sont manquantes !");
    }
  }
}
