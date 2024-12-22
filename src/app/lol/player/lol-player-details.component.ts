import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameOnPlayerService } from '../../shared/services/gameon-player.service';
import { PlayerDto } from '../../shared/classes/PlayerDto';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { LeagueOfLegendsRankHistory } from '../../shared/classes/LeagueOfLegendsRankHistory';

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
  rankHistory: LeagueOfLegendsRankHistory[] = [];
  soloWins = 0;
  soloLosses = 0;
  flexWins = 0;
  flexLosses = 0;
  soloWinRate = 0.0;
  flexWinRate = 0.0;
  overAllWinRate = 0.0;

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
        this.getRankHistory();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  calculateWinRate() {
    if (this.rankHistory.length > 0) {
      let lastSoloRanked = this.rankHistory
        .filter((history) => history.queueType === 'RANKED_SOLO_5x5')
        .pop();

      if (lastSoloRanked != null) {
        this.soloWins = lastSoloRanked.wins;
        this.soloLosses = lastSoloRanked.losses;
        this.soloWinRate =
          (this.soloWins / (this.soloWins + this.soloLosses)) * 100;
      }

      let lastFlexRanked = this.rankHistory
        .filter((history) => history.queueType === 'RANKED_FLEX_SR')
        .pop();

      if (lastFlexRanked != null) {
        this.flexWins = lastFlexRanked.wins;
        this.flexLosses = lastFlexRanked.losses;
        this.flexWinRate =
          (this.flexWins / (this.flexWins + this.flexLosses)) * 100;
      }

      let totalWins = this.soloWins + this.flexWins;
      let totalLosses = this.soloLosses + this.flexLosses;
      this.overAllWinRate = (totalWins / (totalWins + totalLosses)) * 100;
    }
  }

  getRankHistory() {
    this.playerService.getLolRankHistory(this.playerId, 25).subscribe(
      (data) => {
        this.rankHistory = data;
        this.calculateWinRate();
        this.loading = false;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  refreshSummoner() {
    this.loading = true;
    this.playerService.refreshSummonerById(this.playerId).subscribe(
      () => {
        this.getSummoner();
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
