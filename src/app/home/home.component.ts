import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { GameOnCommonService } from '../shared/services/common/gameon-common.service';
import { HomeDataDto } from '../shared/classes/common/HomeDataDto';
import { GameOnPlayerService } from '../shared/services/common/gameon-player.service';
import { Player } from '../shared/classes/common/Player';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  loading = true;
  error = false;
  isLoggedIn = false;

  homeData?: HomeDataDto;

  players: Player[] = [];
  loadingActivePlayers = true;

  infoIcon = faInfoCircle;

  constructor(
    private keycloak: KeycloakService,
    private playerService: GameOnPlayerService,
    private commonService: GameOnCommonService
  ) {
    this.isLoggedIn = this.keycloak.isLoggedIn();
  }

  ngOnInit(): void {
    this.getHomeData();

    this.playerService.getAll().subscribe(
      (data) => {
        this.players = data;
        this.loadingActivePlayers = false;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  login() {
    this.keycloak.login();
  }

  getHomeData() {
    this.commonService.getHomeData().subscribe(
      (data) => {
        this.homeData = data;
        this.loading = false;
      },
      (err) => {
        this.error = true;
        console.error(err);
      }
    );
  }
}
