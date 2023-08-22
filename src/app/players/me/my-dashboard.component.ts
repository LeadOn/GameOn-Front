import { Component, OnInit } from "@angular/core";
import {
  faCalendarAlt,
  faArrowAltCircleLeft,
} from "@fortawesome/free-regular-svg-icons";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { PlatformStats } from "src/app/shared/classes/PlatformStats";
import { Player } from "src/app/shared/classes/Player";
import { YuGamesPlayerService } from "src/app/shared/services/yugames-player.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-my-dashboard",
  templateUrl: "./my-dashboard.component.html",
  styleUrls: ["./my-dashboard.component.scss"],
})
export class MyDashboardComponent implements OnInit {
  player$: Observable<Player>;

  loading = true;
  stats: PlatformStats[] = [];

  calendarIcon = faCalendarAlt;
  backIcon = faArrowAltCircleLeft;

  constructor(
    private playerService: YuGamesPlayerService,
    private store: Store<{ player: Player }>
  ) {
    this.player$ = store.select("player");
  }

  ngOnInit(): void {
    this.loading = true;

    this.player$.subscribe((player) => {
      if (player.id != 0) {
        this.playerService.getStats(player.id).subscribe(
          (data) => {
            this.stats = data;
            this.loading = false;
          },
          (err) => {
            alert("Erreur lors de la récupération des statistiques !");
            console.error(err);
          }
        );
      }
    });
  }

  logout() {
    window.location.replace(
      environment.keycloak.url + "realms/yufoot/protocol/openid-connect/logout"
    );
  }
}
