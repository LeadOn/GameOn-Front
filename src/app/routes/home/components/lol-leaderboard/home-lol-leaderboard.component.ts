import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { PlayerDto } from '../../../../shared/classes/common/PlayerDto';
import { GameOnLoLService } from '../../../../shared/services/leagueoflegends/gameon-lol.service';
import {
  tierLabel,
  tierRankScore,
  tierWinRate,
} from '../../../../shared/classes/lol/lol-tier.util';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-home-lol-leaderboard',
  templateUrl: './home-lol-leaderboard.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HomeLolLeaderboardComponent implements OnInit {
  loading = true;
  players: PlayerDto[] = [];
  currentLoLPatch = '';
  apiUrl = environment.gameOnApiUrl;

  tierLabel = tierLabel;
  winRate = tierWinRate;

  constructor(
    private lolService: GameOnLoLService,
    private lolVersionStore: Store<{ lolVersion: string }>,
  ) {
    this.lolVersionStore
      .select('lolVersion')
      .subscribe((v) => (this.currentLoLPatch = v));
  }

  ngOnInit(): void {
    this.lolService.getAll().subscribe((players) => {
      this.players = players;
      this.loading = false;
    });
  }

  get rankedPlayers(): PlayerDto[] {
    return [...this.players]
      .filter((p) => p.leagueOfLegendsSoloRank != null)
      .sort(
        (a, b) =>
          tierRankScore(a.leagueOfLegendsSoloRank) -
          tierRankScore(b.leagueOfLegendsSoloRank),
      )
      .slice(0, 5);
  }
}
