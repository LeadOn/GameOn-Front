import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FifaPlayerStatsDto } from '../../shared/classes/FifaPlayerStatsDto';
import { Player } from '../../shared/classes/Player';
import { trigger, style, animate, transition } from '@angular/animations';
// import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import { KeycloakService } from 'keycloak-angular';

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
})
export class ProfilePageComponent implements OnInit {
  player$: Observable<Player>;
  stats?: FifaPlayerStatsDto;
  loading = true;
  currentTab = 'profile';
  showSuccess = false;
  // successIcon = faCheckCircle;
  isAdmin = false;

  constructor(
    private store: Store<{ player: Player }>,
    private keycloak: KeycloakService
  ) {
    this.player$ = store.select('player');
    this.isAdmin = this.keycloak.isUserInRole('GameOn_admin');
  }

  ngOnInit(): void {
    this.loading = false;
  }
}
