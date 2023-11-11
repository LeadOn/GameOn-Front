import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FifaTeam } from "src/app/shared/classes/FifaTeam";
import { Platform } from "src/app/shared/classes/Platform";
import { Player } from "src/app/shared/classes/Player";
import { YuGamesFifaTeamService } from "src/app/shared/services/yugames-fifateam.service";
import { YuGamesGameService } from "src/app/shared/services/yugames-game.service";
import { YuGamesPlatformService } from "src/app/shared/services/yugames-platform.service";
import { YuGamesPlayerService } from "src/app/shared/services/yugames-player.service";
import { trigger, style, animate, transition } from "@angular/animations";

@Component({
  selector: "app-fifa-create-game",
  templateUrl: "./fifa-create-game.component.html",
  styleUrls: ["./fifa-create-game.component.scss"],
  animations: [
    trigger("inOutAnimation", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 })),
      ]),
      transition(":leave", [
        style({ opacity: 1 }),
        animate(200, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class FifaCreateGameComponent implements OnInit {
  isLoading = true;
  players: Player[] = [];
  platforms: Platform[] = [];
  fifaTeams: FifaTeam[] = [];

  fifaTeam1 = 0;
  fifaTeam2 = 0;

  createGameForm = new FormGroup({
    teamCode1: new FormControl("", [
      Validators.required,
      Validators.maxLength(5),
    ]),
    teamFifa1: new FormControl(""),
    teamScore1: new FormControl(0, [Validators.required, Validators.min(0)]),
    teamCode2: new FormControl("", [
      Validators.required,
      Validators.maxLength(5),
    ]),
    teamFifa2: new FormControl(""),
    teamScore2: new FormControl(0, [Validators.required, Validators.min(0)]),
    platform: new FormControl("", Validators.required),
    team1: new FormControl([], Validators.required),
    team2: new FormControl([], Validators.required),
    date: new FormControl("", Validators.required),
  });

  constructor(
    private playerService: YuGamesPlayerService,
    private platformService: YuGamesPlatformService,
    private gameService: YuGamesGameService,
    private fifaTeamService: YuGamesFifaTeamService,
    private router: Router
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
    let fifaTeam1Id = 0;

    this.fifaTeams.forEach((team) => {
      if (team.name == fifaTeam1) {
        fifaTeam1Id = team.id;
      }
    });

    if (fifaTeam1Id != 0) {
      body.FifaTeam1 = fifaTeam1Id;
    }

    let fifaTeam2 = this.createGameForm.controls["teamFifa2"].value;
    let fifaTeam2Id = 0;

    this.fifaTeams.forEach((team) => {
      if (team.name == fifaTeam2) {
        fifaTeam2Id = team.id;
      }
    });

    if (fifaTeam2Id != 0) {
      body.FifaTeam2 = fifaTeam2Id;
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
          this.router.navigate(["/fifa"]);
          this.isLoading = false;
        },
        (err) => {
          alert("Erreur lors de la création du match !");
          this.isLoading = false;
        }
      );
    } else {
      alert("Certaines informations sont manquantes !");
      this.isLoading = false;
    }
  }
}
