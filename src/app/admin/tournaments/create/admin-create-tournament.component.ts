import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { YuGamesAdminService } from "../../shared/services/yugames-admin.service";
import { Player } from "src/app/shared/classes/Player";
import { YuGamesPlayerService } from "src/app/shared/services/yugames-player.service";

@Component({
  selector: "app-admin-create-tournament-edit",
  templateUrl: "./admin-create-tournament.component.html",
  styleUrls: ["./admin-create-tournament.component.scss"],
})
export class AdminCreateTournamentComponent implements OnInit {
  loading = false;

  createTournamentForm = new FormGroup({
    name: new FormControl("", [Validators.maxLength(100), Validators.required]),
    description: new FormControl("", [Validators.maxLength(5000)]),
    state: new FormControl(0, [Validators.required]),
    logoUrl: new FormControl("", [Validators.maxLength(3000)]),
    plannedFrom: new FormControl("", [Validators.required]),
    plannedTo: new FormControl("", [Validators.required]),
  });

  constructor(
    private route: ActivatedRoute,
    private playerService: YuGamesPlayerService,
    private adminService: YuGamesAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  createTournament() {
    if (
      this.createTournamentForm.controls["name"].value != null &&
      this.createTournamentForm.controls["name"].value != "" &&
      this.createTournamentForm.controls["state"].value != null &&
      this.createTournamentForm.controls["plannedFrom"].value != null &&
      this.createTournamentForm.controls["plannedFrom"].value != "" &&
      this.createTournamentForm.controls["plannedTo"].value != null &&
      this.createTournamentForm.controls["plannedTo"].value != ""
    ) {
      this.loading = true;

      let description: any = null;
      if (
        this.createTournamentForm.controls["description"].value != null &&
        this.createTournamentForm.controls["description"].value != ""
      ) {
        description = this.createTournamentForm.controls["description"].value;
      }

      let logoUrl: any = null;
      if (
        this.createTournamentForm.controls["logoUrl"].value != null &&
        this.createTournamentForm.controls["logoUrl"].value != ""
      ) {
        logoUrl = this.createTournamentForm.controls["logoUrl"].value;
      }

      this.adminService
        .createTournament(
          this.createTournamentForm.controls["name"].value,
          this.createTournamentForm.controls["state"].value,
          this.createTournamentForm.controls["plannedFrom"].value,
          this.createTournamentForm.controls["plannedTo"].value,
          description,
          logoUrl
        )
        .subscribe(
          (data) => {
            alert("Tournoi créé !");
            this.loading = false;
            this.router.navigate(["/admin/tournaments"]);
          },
          (err) => {
            alert("Erreur lors de la création du tournoi !");
            console.error(err);
            this.loading = false;
          }
        );
    } else {
      alert("Certaines informations sont manquantes !");
    }
  }
}
