import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { YuGamesAdminService } from "../../shared/services/yugames-admin.service";
import { Player } from "src/app/shared/classes/Player";
import { YuGamesPlayerService } from "src/app/shared/services/yugames-player.service";

@Component({
  selector: "app-admin-player-edit",
  templateUrl: "./admin-player-edit.component.html",
  styleUrls: ["./admin-player-edit.component.scss"],
})
export class AdminPlayerEditComponent implements OnInit {
  playerId: any;
  player: Player = new Player();
  loading = true;

  updatePlayerForm = new FormGroup({
    keycloakId: new FormControl("", [Validators.maxLength(50)]),
    fullName: new FormControl("", [
      Validators.required,
      Validators.maxLength(100),
    ]),
    nickname: new FormControl("", [
      Validators.required,
      Validators.maxLength(50),
    ]),
    profilePicUrl: new FormControl("", [
      Validators.required,
      Validators.maxLength(500),
    ]),
  });

  constructor(
    private route: ActivatedRoute,
    private playerService: YuGamesPlayerService,
    private adminService: YuGamesAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.playerId = this.route.snapshot.paramMap.get("id");

    this.playerService.get(this.playerId).subscribe(
      (data) => {
        this.loading = false;
        this.player = data;

        if (data.keycloakId != null) {
          this.updatePlayerForm.controls["keycloakId"].setValue(
            data.keycloakId
          );
        }

        this.updatePlayerForm.controls["fullName"].setValue(data.fullName);
        this.updatePlayerForm.controls["nickname"].setValue(data.nickname);

        if (data.profilePictureUrl != null) {
          this.updatePlayerForm.controls["profilePicUrl"].setValue(
            data.profilePictureUrl
          );
        }
      },
      (err) => {
        console.error(err);
        alert("Une erreur est survenue lors de la récupération du joueur.");
        this.loading = false;
      }
    );
  }

  updatePlayer() {
    if (
      this.updatePlayerForm.controls["fullName"].value != null &&
      this.updatePlayerForm.controls["fullName"].value != "" &&
      this.updatePlayerForm.controls["nickname"].value != null &&
      this.updatePlayerForm.controls["nickname"].value != "" &&
      this.updatePlayerForm.controls["profilePicUrl"].value != null &&
      this.updatePlayerForm.controls["profilePicUrl"].value != ""
    ) {
      this.loading = true;

      let keycloakId: any = null;

      if (
        this.updatePlayerForm.controls["keycloakId"].value != null &&
        this.updatePlayerForm.controls["keycloakId"].value != ""
      ) {
        keycloakId = this.updatePlayerForm.controls["keycloakId"].value;
      }

      this.adminService
        .updatePlayer(
          this.playerId,
          this.updatePlayerForm.controls["fullName"].value,
          this.updatePlayerForm.controls["nickname"].value,
          this.updatePlayerForm.controls["profilePicUrl"].value,
          keycloakId
        )
        .subscribe(
          (data) => {
            alert("Joueur mis à jour !");
            this.loading = false;
            this.router.navigate(["/admin/players"]);
          },
          (err) => {
            alert("Erreur lors de la mise à jour du joueur !");
            console.error(err);
            this.loading = false;
          }
        );
    } else {
      alert("Certaines informations sont manquantes !");
    }
  }
}
