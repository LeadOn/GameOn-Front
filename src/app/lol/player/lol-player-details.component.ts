import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameOnPlayerService } from '../../shared/services/gameon-player.service';
import { PlayerDto } from '../../shared/classes/PlayerDto';
import { faSync } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-lol-player-details',
  templateUrl: './lol-player-details.component.html',
  styleUrl: './lol-player-details.component.scss',
})
export class LolPlayerDetailsComponent implements OnInit {
  playerId: any;
  loading = true;
  player?: PlayerDto;
  refreshIcon = faSync;

  constructor(
    private route: ActivatedRoute,
    private playerService: GameOnPlayerService
  ) {}

  ngOnInit(): void {
    this.playerId = this.route.snapshot.paramMap.get('id');
    this.getSummoner();
  }

  getSummoner() {
    this.playerService.getSummoner(this.playerId).subscribe(
      (player) => {
        this.player = player;
        this.loading = false;
        console.log(this.player);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  refreshSummoner() {
    this.loading = true;
    this.playerService.refreshSummonerById(this.playerId).subscribe(
      (data) => {
        this.getSummoner();
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
