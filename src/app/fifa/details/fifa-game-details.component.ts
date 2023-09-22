import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FifaGamePlayed } from "src/app/shared/classes/FifaGamePlayed";
import { YuGamesGameService } from "src/app/shared/services/yugames-game.service";
import { trigger, style, animate, transition } from "@angular/animations";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { YuGamesHighlightService } from "src/app/shared/services/yugames-highlight.service";
import { CreateHighlightDto } from "src/app/shared/classes/CreateHighlightDto";
import { KeycloakService } from "keycloak-angular";

@Component({
  selector: "app-fifa-game-details",
  templateUrl: "./fifa-game-details.component.html",
  styleUrls: ["./fifa-game-details.component.scss"],
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
export class FifaGameDetailsComponent implements OnInit {
  gameId: any;
  loading = true;
  game: FifaGamePlayed = new FifaGamePlayed();
  externalIcon = faExternalLinkAlt;
  successMessage = false;
  isLoggedIn = false;
  isAdmin = false;

  createHighlightForm = new FormGroup({
    name: new FormControl("", [Validators.maxLength(50), Validators.required]),
    description: new FormControl("", [Validators.maxLength(500)]),
    externalUrl: new FormControl("", [Validators.maxLength(300)]),
  });

  constructor(
    private route: ActivatedRoute,
    private gameService: YuGamesGameService,
    private highlightService: YuGamesHighlightService,
    private keycloak: KeycloakService
  ) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get("id");

    this.keycloak.isLoggedIn().then((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      this.isAdmin = this.keycloak.isUserInRole("yugames_admin");
    });

    this.getGame();
  }

  getGame() {
    this.gameService.getById(this.gameId).subscribe(
      (data) => {
        this.game = data;
        this.loading = false;
      },
      (err) => {
        alert("Une erreur est survenue lors de la récupération du match.");
        console.error(err);
      }
    );
  }

  createHighlight() {
    if (
      this.loading == false &&
      this.createHighlightForm.controls["name"].value != null
    ) {
      this.loading = true;
      this.successMessage = false;

      let createObj = new CreateHighlightDto();
      createObj.name = this.createHighlightForm.controls["name"].value;

      if (this.createHighlightForm.controls["description"].value != null) {
        createObj.description =
          this.createHighlightForm.controls["description"].value;
      }

      if (this.createHighlightForm.controls["externalUrl"].value != null) {
        createObj.externalUrl =
          this.createHighlightForm.controls["externalUrl"].value;
      }

      createObj.fifaGameId = this.gameId;

      this.highlightService.create(createObj).subscribe(
        (data) => {
          this.successMessage = true; // Getting its account, and setting it into store
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          alert("Une erreur est survenue lors de la création du temps fort !");
        }
      );
    }
  }
}
