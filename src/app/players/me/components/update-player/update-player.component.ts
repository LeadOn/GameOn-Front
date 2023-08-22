import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Player } from "src/app/shared/classes/Player";
import { YuGamesPlayerService } from "src/app/shared/services/yugames-player.service";
import { setPlayer } from "src/app/store/actions/player.actions";

@Component({
  selector: "app-update-player",
  templateUrl: "./update-player.component.html",
  styleUrls: ["./update-player.component.scss"],
})
export class UpdatePlayerComponent implements OnInit, OnChanges {
  @Input()
  player: Player = new Player();

  isLoading = false;

  constructor(
    private playerService: YuGamesPlayerService,
    private store: Store<{ player: Player }>
  ) {}

  updatePlayerForm = new FormGroup({
    fullName: new FormControl("", [Validators.maxLength(100)]),
    nickname: new FormControl("", [Validators.maxLength(100)]),
    profilePictureUrl: new FormControl("", [Validators.maxLength(500)]),
  });

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["player"] != null) {
      this.updatePlayerForm.controls["fullName"].setValue(
        changes["player"].currentValue.fullName
      );

      this.updatePlayerForm.controls["nickname"].setValue(
        changes["player"].currentValue.nickname
      );

      this.updatePlayerForm.controls["profilePictureUrl"].setValue(
        changes["player"].currentValue.profilePictureUrl
      );
    }
  }

  updateUser() {
    if (this.isLoading == false) {
      this.isLoading = true;
      this.playerService
        .update(
          this.updatePlayerForm.controls["fullName"].value,
          this.updatePlayerForm.controls["nickname"].value,
          this.updatePlayerForm.controls["profilePictureUrl"].value
        )
        .subscribe(
          (data) => {
            alert("Mise à jour réussie !"); // Getting its account, and setting it into store
            this.store.dispatch(setPlayer({ player: data }));
            console.log("[UpdatePlayer]", "Player stored.");
            this.isLoading = false;
          },
          (err) => {
            this.isLoading = false;
            alert("Une erreur est survenue lors de la mise à jour du compte !");
          }
        );
    }
  }
}
