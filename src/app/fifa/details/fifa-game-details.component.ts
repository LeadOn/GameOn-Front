import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FifaGamePlayed } from "src/app/shared/classes/FifaGamePlayed";
import { YuGamesGameService } from "src/app/shared/services/yugames-game.service";

@Component({
  selector: "app-fifa-game-details",
  templateUrl: "./fifa-game-details.component.html",
  styleUrls: ["./fifa-game-details.component.scss"],
})
export class FifaGameDetailsComponent implements OnInit {
  gameId: any;
  loading = true;
  game: FifaGamePlayed = new FifaGamePlayed();
  externalIcon = faExternalLinkAlt;

  constructor(
    private route: ActivatedRoute,
    private gameService: YuGamesGameService
  ) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get("id");

    this.gameService.getById(this.gameId).subscribe(
      (data) => {
        this.game = data;
        this.loading = false;
      },
      (err) => {
        alert("Une erreur est survenue lors de la récupération du match.");
        console.log(err);
      }
    );
  }
}
