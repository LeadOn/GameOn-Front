import { Component, ChangeDetectionStrategy } from '@angular/core';

interface LeaderboardEntryPlaceholder {
  rank: number;
  nickname: string;
  tag: string;
  tier: string;
  lp: number;
  winRate: number;
}

@Component({
  selector: 'app-home-lol-leaderboard',
  templateUrl: './home-lol-leaderboard.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HomeLolLeaderboardComponent {
  // Placeholder : aucun endpoint de classement LoL n'existe encore côté API.
  entries: LeaderboardEntryPlaceholder[] = [
    { rank: 1, nickname: 'Hugo', tag: 'Hugz#EUW', tier: 'Diamond IV', lp: 42, winRate: 56 },
    { rank: 2, nickname: 'Théo', tag: 'TheoTeo#EUW', tier: 'Emerald II', lp: 64, winRate: 54 },
    { rank: 3, nickname: 'Maxime', tag: 'Maxou#EUW', tier: 'Emerald IV', lp: 18, winRate: 51 },
    { rank: 4, nickname: 'Antoine', tag: 'Antobo#EUW', tier: 'Platinum I', lp: 33, winRate: 49 },
    { rank: 5, nickname: 'Valentin', tag: 'Valou#EUW', tier: 'Platinum I', lp: 18, winRate: 47 },
  ];
}
