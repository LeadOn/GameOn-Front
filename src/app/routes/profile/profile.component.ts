import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  faArrowRight,
  faCalendar,
  faCog,
  faExternalLink,
  faKey,
  faLockOpen,
  faSoccerBall,
} from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GameOnLoLService } from '../../shared/services/leagueoflegends/gameon-lol.service';
import { GameOnPlayerService } from '../../shared/services/common/gameon-player.service';
import { Player } from '../../shared/classes/common/Player';
import { FifaPlayerStatsDto } from '../../shared/classes/fifa/FifaPlayerStatsDto';
import Keycloak from 'keycloak-js';
import { setPlayer } from '../../core/store/actions/player.actions';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: false,
})
export class ProfilePageComponent implements OnInit, OnChanges {
  private readonly keycloak = inject(Keycloak);

  player$: Observable<Player>;
  stats?: FifaPlayerStatsDto;
  loading = true;
  currentTab = 'profile';
  showSuccess = false;
  isAdmin = false;
  adminIcon = faCog;
  arrowRightIcon = faArrowRight;
  keyIcon = faKey;
  externalIcon = faExternalLink;
  token: string = '';
  logoutIcon = faLockOpen;
  calendarIcon = faCalendar;
  soccerIcon = faSoccerBall;
  apiUrl = environment.gameOnApiUrl;
  currentFile?: File;

  @Input()
  player: Player = new Player();

  @Input()
  successMessage: boolean = false;
  @Output() successMessageChange = new EventEmitter<boolean>();

  updatePlayerForm = new FormGroup({
    fullName: new FormControl('', [
      Validators.maxLength(100),
      Validators.required,
    ]),
    nickname: new FormControl('', [
      Validators.maxLength(100),
      Validators.required,
    ]),
    riotGamesNickname: new FormControl('', [Validators.maxLength(500)]),
    riotGamesTagLine: new FormControl('', [Validators.maxLength(500)]),
  });

  constructor(
    private store: Store<{ player: Player }>,
    private playerService: GameOnPlayerService,
    private lolService: GameOnLoLService,
  ) {
    this.player$ = store.select('player');

    this.player$.subscribe((x) => {
      this.updatePlayerForm.controls['fullName'].setValue(x.fullName);
      this.updatePlayerForm.controls['nickname'].setValue(x.nickname);
      if (x.riotGamesNickname != null) {
        this.updatePlayerForm.controls['riotGamesNickname'].setValue(
          x.riotGamesNickname,
        );
      }

      if (x.riotGamesTagLine != null) {
        this.updatePlayerForm.controls['riotGamesTagLine'].setValue(
          x.riotGamesTagLine,
        );
      }
    });

    this.isAdmin = this.keycloak.hasRealmRole('gameon_admin');

    if (this.keycloak.token != null) {
      this.token = this.keycloak.token;
    }
  }

  ngOnInit(): void {
    this.loading = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['player'] != null) {
      this.updatePlayerForm.controls['fullName'].setValue(
        changes['player'].currentValue.fullName,
      );

      this.updatePlayerForm.controls['nickname'].setValue(
        changes['player'].currentValue.nickname,
      );
    }
  }

  uploadProfilePicture(event: any) {
    if (event.target.files.length > 0) {
      this.currentFile = event.target.files[0];
    }
  }

  logout() {
    window.location.replace(
      environment.keycloak.url +
        '/realms/gameon/protocol/openid-connect/logout',
    );
  }

  updateUser() {
    if (this.loading == false) {
      let riotGamesNickname: string | undefined = undefined;
      let riotGamesTagLine: string | undefined = undefined;

      if (
        this.updatePlayerForm.controls['riotGamesNickname'].value != null &&
        this.updatePlayerForm.controls['riotGamesNickname'].value != ''
      ) {
        riotGamesNickname =
          this.updatePlayerForm.controls['riotGamesNickname'].value;
      }

      if (
        this.updatePlayerForm.controls['riotGamesTagLine'].value != null &&
        this.updatePlayerForm.controls['riotGamesTagLine'].value != ''
      ) {
        riotGamesTagLine =
          this.updatePlayerForm.controls['riotGamesTagLine'].value;
      }

      this.loading = true;

      if (this.currentFile != null) {
        this.playerService.updateProfilePicture(this.currentFile).subscribe(
          (data) => {},
          (err) => {
            this.loading = false;
            alert(
              'Une erreur est survenue lors de la mise à jour de la photo de profil !',
            );
          },
        );
      }

      if (this.loading == true) {
        this.playerService
          .update(
            this.updatePlayerForm.controls['fullName'].value,
            this.updatePlayerForm.controls['nickname'].value,
            riotGamesNickname,
            riotGamesTagLine,
          )
          .subscribe(
            (data) => {
              this.successMessage = true; // Getting its account, and setting it into store
              this.successMessageChange.emit(true);
              this.store.dispatch(setPlayer({ player: data }));
              this.loading = false;
            },
            (err) => {
              this.loading = false;
              alert(
                'Une erreur est survenue lors de la mise à jour du compte !',
              );
            },
          );
      }
    }
  }

  refreshSummoner() {
    if (this.loading == false) {
      this.loading = true;
      this.lolService.refreshCurrent().subscribe(
        (data) => {
          this.successMessage = true; // Getting its account, and setting it into store
          this.successMessageChange.emit(true);
          this.store.dispatch(setPlayer({ player: data }));
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          alert('Une erreur est survenue lors de la mise à jour du compte !');
        },
      );
    }
  }
}
