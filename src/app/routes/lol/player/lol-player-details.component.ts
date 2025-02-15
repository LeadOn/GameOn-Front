import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faExternalLink, faSync } from '@fortawesome/free-solid-svg-icons';
import { PlayerDto } from '../../../shared/classes/common/PlayerDto';
import { LeagueOfLegendsRankHistory } from '../../../shared/classes/lol/LeagueOfLegendsRankHistory';
import { LoLGame } from '../../../shared/classes/lol/LoLGame';
import { environment } from '../../../../environments/environment';
import { GameOnLoLService } from '../../../shared/services/leagueoflegends/gameon-lol.service';

@Component({
  selector: 'app-lol-player-details',
  templateUrl: './lol-player-details.component.html',
  styleUrl: './lol-player-details.component.css',
  standalone: false,
})
export class LolPlayerDetailsComponent implements OnInit {
  playerId: any;
  loading = true;
  gameHistoryLoading = true;
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
  gamesPlayed: LoLGame[] = [];
  currentLoLPatch: string = environment.currentLoLPatch;
  syncIcon = faSync;
  externalIcon = faExternalLink;

  constructor(
    private route: ActivatedRoute,
    private lolService: GameOnLoLService,
  ) {}

  ngOnInit(): void {
    this.playerId = this.route.snapshot.paramMap.get('id');
    this.getSummoner();
  }

  getSummoner() {
    this.lolService.getById(this.playerId).subscribe(
      (player) => {
        this.player = player;
        this.getRankHistory();
        this.getLastGamesPlayed();
      },
      (err) => {
        console.error(err);
      },
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
    this.lolService.getRankHistory(this.playerId, 25).subscribe(
      (data) => {
        this.rankHistory = data;
        this.calculateWinRate();
        this.loading = false;
      },
      (err) => {
        console.error(err);
      },
    );
  }

  getLastGamesPlayed() {
    this.lolService.getLastGamesPlayed(this.playerId).subscribe(
      (data) => {
        this.gamesPlayed = data;
        this.gameHistoryLoading = false;
      },
      (err) => {
        console.error(err);
      },
    );
  }

  refreshSummoner() {
    this.loading = true;
    this.lolService.refreshById(this.playerId).subscribe(
      () => {
        this.getSummoner();
        this.getLastGamesPlayed();
      },
      (err) => {
        console.error(err);
      },
    );
  }

  refreshGame(matchId: string) {
    this.gameHistoryLoading = true;
    this.lolService.refreshGame(matchId).subscribe(
      (data) => {
        this.getLastGamesPlayed();
      },
      (err) => {
        console.error(err);
      },
    );
  }
}
