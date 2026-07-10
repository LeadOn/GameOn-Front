import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  faInfoCircle,
  faFutbol,
} from '@fortawesome/free-solid-svg-icons';
import Keycloak from 'keycloak-js';
import { HomeDataDto } from '../../shared/classes/common/HomeDataDto';
import { GameOnCommonService } from '../../shared/services/common/gameon-common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  soccerIcon = faFutbol;

  constructor(private commonService: GameOnCommonService) {
    this.isLoggedIn =
      this.keycloak.authenticated != null && this.keycloak.authenticated
        ? true
        : false;
  }

  ngOnInit(): void {
    this.getHomeData();
  }

  getHomeData() {
    this.commonService.getHomeData().subscribe(
      (data) => {
        this.homeData = data;
        this.loading = false;
      },
      (err) => {
        this.error = true;
        this.loading = false;
        console.error(err);
      },
    );
  }
}
