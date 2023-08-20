import { Component, OnInit } from "@angular/core";
import { Highlight } from "src/app/shared/classes/Highlight";
import { Platform } from "src/app/shared/classes/Platform";
import { Player } from "src/app/shared/classes/Player";
import { YuFootHighlightService } from "src/app/shared/services/yufoot-highlight.service";
import { YuFootPlatformService } from "src/app/shared/services/yufoot-platform.service";
import { YuFootPlayerService } from "src/app/shared/services/yufoot-player.service";

@Component({
  selector: "app-admin-highlights",
  templateUrl: "./admin-highlights.component.html",
  styleUrls: ["./admin-highlights.component.scss"],
})
export class AdminHighlightsComponent implements OnInit {
  highlights: Highlight[] = [];
  loading = true;

  constructor(private highlightService: YuFootHighlightService) {}

  ngOnInit(): void {
    this.highlightService.getAll().subscribe(
      (data) => {
        this.highlights = data;
        this.loading = false;
      },
      (err) => {
        alert(
          "Une erreur est survenue lors de la récupération des temps forts."
        );
        console.error(err);
        this.loading = false;
      }
    );
  }
}
