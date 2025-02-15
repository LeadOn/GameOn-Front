import { Component, inject, OnInit } from '@angular/core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Keycloak from 'keycloak-js';
import { HomeDataDto } from '../../shared/classes/common/HomeDataDto';
import { GameOnCommonService } from '../../shared/services/common/gameon-common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  private readonly keycloak = inject(Keycloak);

  loading = true;
  error = false;
  isLoggedIn = false;

  homeData?: HomeDataDto;

  loadingActivePlayers = true;

  infoIcon = faInfoCircle;

  constructor(private commonService: GameOnCommonService) {
    this.isLoggedIn =
      this.keycloak.authenticated != null && this.keycloak.authenticated
        ? true
        : false;
  }

  ngOnInit(): void {
    this.getHomeData();
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
      },
    );
  }
}
