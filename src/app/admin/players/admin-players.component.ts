import { Component, OnInit } from '@angular/core';
import { Player } from '../../shared/classes/Player';
import { GameOnPlayerService } from '../../shared/services/gameon-player.service';

@Component({
  selector: 'app-admin-players',
  templateUrl: './admin-players.component.html',
  styleUrls: ['./admin-players.component.scss'],
})
export class AdminPlayersComponent implements OnInit {
  players: Player[] = [];
  loading = true;

  constructor(private playerService: GameOnPlayerService) {}

  ngOnInit(): void {
    this.playerService.getAll().subscribe(
      (data) => {
        this.players = data;

        this.playerService.getAll(true).subscribe(
          (data) => {
            this.players = this.players.concat(data);
            this.loading = false;
          },
          (err) => {
            alert(
              'Une erreur est survenue lors de la récupération des players.'
            );
            console.error(err);
            this.loading = false;
          }
        );
      },
      (err) => {
        alert('Une erreur est survenue lors de la récupération des players.');
        console.error(err);
        this.loading = false;
      }
    );
  }
}
