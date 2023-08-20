import { Component, OnInit } from "@angular/core";
import { Player } from "src/app/shared/classes/Player";
import { YuFootPlayerService } from "src/app/shared/services/yufoot-player.service";

@Component({
  selector: "app-admin-home",
  templateUrl: "./admin-home.component.html",
  styleUrls: ["./admin-home.component.scss"],
})
export class AdminHomeComponent implements OnInit {
  player: Player = new Player();

  constructor(private playerService: YuFootPlayerService) {}

  ngOnInit(): void {
    this.playerService.getCurrent().subscribe(
      (data) => {
        this.player = data;
      },
      (err) => {
        alert("Une erreur est survenue lors de la récupération du profile.");
        console.error(err);
      }
    );
  }
}
