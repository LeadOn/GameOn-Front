import { Component, Input } from '@angular/core';
import { TopTeamStatDto } from '../../classes/fifa/TopTeamStatDto';

@Component({
  selector: 'app-player-team-list',
  templateUrl: './player-team-list.component.html',
  styleUrls: ['./player-team-list.component.css'],
  standalone: false,
})
export class PlayerTeamListComponent {
  @Input()
  teamList: TopTeamStatDto[] = [];

  @Input()
  title: string = "Liste d'équipe";
}
