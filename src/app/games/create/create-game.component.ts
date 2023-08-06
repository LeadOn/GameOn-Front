import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Platform } from "src/app/classes/Platform";
import { Player } from "src/app/classes/Player";
import { YuFootApiService } from "src/app/services/yufoot-api.service";

@Component({
  selector: "app-create-game",
  templateUrl: "./create-game.component.html",
  styleUrls: ["./create-game.component.scss"],
})
export class CreateGameComponent implements OnInit {
  isLoading = true;
  players: Player[] = [];
  platforms: Platform[] = [];

  createGameForm = new FormGroup({
    teamCode1: new FormControl("", [
      Validators.required,
      Validators.maxLength(5),
    ]),
    teamScore1: new FormControl(0, Validators.required),
    teamCode2: new FormControl("", [
      Validators.required,
      Validators.maxLength(5),
    ]),
    teamScore2: new FormControl(0, Validators.required),
    platform: new FormControl("", Validators.required),
    team1: new FormControl([], Validators.required),
    team2: new FormControl([], Validators.required),
    date: new FormControl("", Validators.required),
  });

  constructor(private yuFootApi: YuFootApiService) {}

  ngOnInit(): void {
    this.yuFootApi.getPlayers().subscribe((data) => {
      this.players = data;
      this.yuFootApi.getPlatforms().subscribe((data2) => {
        this.platforms = data2;
        this.createGameForm.controls["platform"].setValue(
          data2[0].id.toString()
        );

        this.isLoading = false;
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
      CreatedOn: formatDate(new Date(), "yyyy-MM-ddTHH:mm:ss", "en-US"),
    };

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
      this.yuFootApi.createGame(body).subscribe(
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
