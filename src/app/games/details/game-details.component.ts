import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { GamePlayed } from "src/app/shared/classes/GamePlayed";
import { YuFootGameService } from "src/app/shared/services/yufoot-game.service";

@Component({
  selector: "app-game-details",
  templateUrl: "./game-details.component.html",
  styleUrls: ["./game-details.component.scss"],
})
export class GameDetailsComponent implements OnInit {
  gameId: any;
  loading = true;
  game: GamePlayed = new GamePlayed();
  externalIcon = faExternalLinkAlt;

  constructor(
    private route: ActivatedRoute,
    private gameService: YuFootGameService
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
