import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Player } from '../../../../shared/classes/common/Player';
import { PlayerDto } from '../../../../shared/classes/common/PlayerDto';
import { GameOnLoLService } from '../../../../shared/services/leagueoflegends/gameon-lol.service';
import {
  tierEmblemUrl,
  tierGlowShadow,
  tierLabel,
  tierWinRate,
} from '../../../../shared/classes/lol/lol-tier.util';

@Component({
  selector: 'app-home-lol-season-card',
  templateUrl: './home-lol-season-card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HomeLolSeasonCardComponent implements OnChanges {
  @Input()
  isLoggedIn: boolean = false;

  player$: Observable<Player>;

  loading = true;
  lolPlayer?: PlayerDto;
  playerId?: number;

  historyIcon = faChartLine;

  tierLabel = tierLabel;
  tierEmblemUrl = tierEmblemUrl;
  tierGlowShadow = tierGlowShadow;
  tierWinRate = tierWinRate;

  constructor(
    private playerStore: Store<{ player: Player }>,
    private lolService: GameOnLoLService,
  ) {
    this.player$ = this.playerStore.select('player');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLoggedIn'])
      this.isLoggedIn = changes['isLoggedIn'].currentValue;

    if (this.isLoggedIn) {
      this.player$.subscribe((x) => {
        this.playerId = x.id;
        this.lolService.getById(x.id).subscribe((player) => {
          this.lolPlayer = player;
          this.loading = false;
        });
      });
    }
  }

  get soloRank() {
    return this.lolPlayer?.leagueOfLegendsSoloRank;
  }

  get flexRank() {
    return this.lolPlayer?.leagueOfLegendsFlexRank;
  }

  get soloGamesPlayed(): number {
    return this.soloRank ? this.soloRank.wins + this.soloRank.losses : 0;
  }

  get flexGamesPlayed(): number {
    return this.flexRank ? this.flexRank.wins + this.flexRank.losses : 0;
  }
}
