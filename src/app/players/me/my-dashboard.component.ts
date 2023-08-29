import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { FifaPlayerStatsDto } from "src/app/shared/classes/FifaPlayerStatsDto";
import { Player } from "src/app/shared/classes/Player";
import { trigger, style, animate, transition } from "@angular/animations";
import { faCheckCircle, faClose } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-my-dashboard",
  templateUrl: "./my-dashboard.component.html",
  styleUrls: ["./my-dashboard.component.scss"],
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
export class MyDashboardComponent implements OnInit {
  player$: Observable<Player>;
  stats?: FifaPlayerStatsDto;
  loading = true;
  currentTab = "profile";
  showSuccess = false;
  successIcon = faCheckCircle;

  constructor(private store: Store<{ player: Player }>) {
    this.player$ = store.select("player");
  }

  ngOnInit(): void {
    this.loading = false;
  }
}
