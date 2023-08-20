import { Component } from "@angular/core";
import { GamePlayed } from "src/app/shared/classes/GamePlayed";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { YuFootGameService } from "src/app/shared/services/yufoot-game.service";

@Component({
  selector: "app-games-played",
  templateUrl: "./games-played.component.html",
  styleUrls: ["./games-played.component.scss"],
})
export class GamesPlayedComponent {
  games: GamePlayed[] = [];
  numberOfGames = 10;
  loading = true;
  externalIcon = faExternalLinkAlt;

  constructor(private gameService: YuFootGameService) {}

  ngOnInit(): void {
    this.getGames();
  }

  getGames() {
    this.loading = true;
    this.gameService.getLast(this.numberOfGames).subscribe((data) => {
      this.games = data;
      this.loading = false;
    });
  }
}
