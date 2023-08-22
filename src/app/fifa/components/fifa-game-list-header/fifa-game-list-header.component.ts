import { Component } from "@angular/core";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-fifa-game-list-header",
  templateUrl: "./fifa-game-list-header.component.html",
  styleUrls: ["./fifa-game-list-header.component.scss"],
})
export class FifaGameListHeaderComponent {
  externalIcon = faExternalLinkAlt;
}
