import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { faEdit, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { GameOnPlayerService } from '../../shared/services/common/gameon-player.service';
import { Player } from '../../shared/classes/common/Player';

@Component({
  selector: 'app-admin-players',
  templateUrl: './admin-players.component.html',
  styleUrls: ['./admin-players.component.css'],
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
  standalone: false,
})
export class AdminPlayersComponent implements OnInit {
  players: Player[] = [];
  loading = true;
  playerIcon = faUserCircle;
  editIcon = faEdit;

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
              'Une erreur est survenue lors de la récupération des players.',
            );
            console.error(err);
            this.loading = false;
          },
        );
      },
      (err) => {
        alert('Une erreur est survenue lors de la récupération des players.');
        console.error(err);
        this.loading = false;
      },
    );
  }
}
