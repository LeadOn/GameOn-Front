import { Component, OnInit } from '@angular/core';
import { AdminDashboard } from '../shared/classes/AdminDashboard';
import {
  faComputer,
  faEdit,
  faRankingStar,
  faSoccerBall,
  faTrophy,
  faUserCircle,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { GameOnChangelogService } from '../../shared/services/common/gameon-changelog.service';
import { Changelog } from '../../shared/classes/common/Changelog';

@Component({
  selector: 'app-admin-changelog-home',
  templateUrl: './admin-changelog-home.component.html',
  styleUrls: ['./admin-changelog-home.component.css'],
  standalone: false,
})
export class AdminChangelogHomeComponent implements OnInit {
  loading = true;
  platformIcon = faComputer;
  playerIcon = faUserCircle;
  soccerIcon = faSoccerBall;
  hightlightIcon = faVideo;
  seasonIcon = faRankingStar;
  tournamentIcon = faTrophy;
  editIcon = faEdit;

  changelogs: Changelog[] = [];

  constructor(private changelogService: GameOnChangelogService) {}

  ngOnInit(): void {
    this.changelogService.getAll().subscribe(
      (data) => {
        this.loading = false;
        this.changelogs = data;
      },
      (err) => {
        this.loading = false;
        alert(
          'Une erreur est survenue lors de la récupération des nouveautés.',
        );
        console.error(err);
      },
    );
  }
}
