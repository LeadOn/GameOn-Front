import {
  Component,
  Input,
  Output,
  OnChanges,
  OnInit,
  EventEmitter,
  SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Player } from "src/app/shared/classes/Player";
import { YuGamesPlayerService } from "src/app/shared/services/yugames-player.service";
import { setPlayer } from "src/app/store/actions/player.actions";
import { trigger, style, animate, transition } from "@angular/animations";

@Component({
  selector: "app-update-player-tab",
  templateUrl: "./update-player-tab.component.html",
  styleUrls: ["./update-player-tab.component.scss"],
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
export class UpdatePlayerTabComponent implements OnInit, OnChanges {
  @Input()
  player: Player = new Player();

  @Input()
  successMessage: boolean = false;
  @Output() successMessageChange = new EventEmitter<boolean>();

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
            this.successMessage = true; // Getting its account, and setting it into store
            this.successMessageChange.emit(true);
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
