import { Component, OnInit } from '@angular/core';
import { Player } from '../../../shared/classes/Player';
import { GameOnPlayerService } from '../../../shared/services/gameon-player.service';

@Component({
  selector: 'app-home-players',
  templateUrl: './home-players.component.html',
  styleUrls: ['./home-players.component.scss'],
})
export class HomePlayersComponent implements OnInit {
  players: Player[] = [];
  loading = true;

  constructor(private playerService: GameOnPlayerService) {}

  ngOnInit(): void {
    this.playerService.getAll().subscribe(
      (data) => {
        this.players = data;
        this.loading = false;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
