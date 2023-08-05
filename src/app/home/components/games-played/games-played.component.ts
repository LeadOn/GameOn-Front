import { Component } from "@angular/core";
import { GamePlayed } from "src/app/classes/GamePlayed";
import { YuFootApiService } from "src/app/services/yufoot-api.service";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

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

  constructor(private yuFootApi: YuFootApiService) {}

  ngOnInit(): void {
    this.getGames();
  }

  getGames() {
    this.loading = true;
    this.yuFootApi.getLastGamesPlayed(this.numberOfGames).subscribe((data) => {
      this.games = data;
      this.loading = false;
    });
  }
}
