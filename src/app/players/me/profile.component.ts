import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FifaPlayerStatsDto } from '../../shared/classes/FifaPlayerStatsDto';
import { Player } from '../../shared/classes/Player';
import { trigger, style, animate, transition } from '@angular/animations';
import { KeycloakService } from 'keycloak-angular';
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
import { GameOnPlayerService } from '../../shared/services/gameon-player.service';
import { setPlayer } from '../../store/actions/player.actions';
import { GameOnLoLService } from '../../shared/services/leagueoflegends/gameon-lol.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    animations: [
        trigger('inOutAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(200, style({ opacity: 1 })),
            ]),
            transition(':leave', [
                style({ opacity: 1 }),
                animate(200, style({ opacity: 0 })),
            ]),
        ]),
    ],
    standalone: false
})
export class ProfilePageComponent implements OnInit, OnChanges {
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

  @Input()
  player: Player = new Player();

  @Input()
  successMessage: boolean = false;
  @Output() successMessageChange = new EventEmitter<boolean>();

  updatePlayerForm = new FormGroup({
    fullName: new FormControl('', [Validators.maxLength(100)]),
    nickname: new FormControl('', [Validators.maxLength(100)]),
    profilePictureUrl: new FormControl('', [Validators.maxLength(500)]),
    riotGamesNickname: new FormControl('', [Validators.maxLength(500)]),
    riotGamesTagLine: new FormControl('', [Validators.maxLength(500)]),
  });

  constructor(
    private store: Store<{ player: Player }>,
    private keycloak: KeycloakService,
    private playerService: GameOnPlayerService,
    private lolService: GameOnLoLService
  ) {
    this.player$ = store.select('player');

    this.player$.subscribe((x) => {
      this.updatePlayerForm.controls['fullName'].setValue(x.fullName);
      this.updatePlayerForm.controls['nickname'].setValue(x.nickname);
      this.updatePlayerForm.controls['profilePictureUrl'].setValue(
        x.profilePictureUrl
      );
      if (x.riotGamesNickname != null) {
        this.updatePlayerForm.controls['riotGamesNickname'].setValue(
          x.riotGamesNickname
        );
      }

      if (x.riotGamesTagLine != null) {
        this.updatePlayerForm.controls['riotGamesTagLine'].setValue(
          x.riotGamesTagLine
        );
      }
    });

    this.isAdmin = this.keycloak.isUserInRole('gameon_admin');

    this.keycloak.getToken().then((x) => {
      this.token = x;
    });
  }

  ngOnInit(): void {
    this.loading = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['player'] != null) {
      this.updatePlayerForm.controls['fullName'].setValue(
        changes['player'].currentValue.fullName
      );

      this.updatePlayerForm.controls['nickname'].setValue(
        changes['player'].currentValue.nickname
      );

      this.updatePlayerForm.controls['profilePictureUrl'].setValue(
        changes['player'].currentValue.profilePictureUrl
      );
    }
  }

  logout() {
    window.location.replace(
      environment.keycloak.url + '/realms/gameon/protocol/openid-connect/logout'
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
      this.playerService
        .update(
          this.updatePlayerForm.controls['fullName'].value,
          this.updatePlayerForm.controls['nickname'].value,
          this.updatePlayerForm.controls['profilePictureUrl'].value,
          riotGamesNickname,
          riotGamesTagLine
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
            alert('Une erreur est survenue lors de la mise à jour du compte !');
          }
        );
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
        }
      );
    }
  }
}
