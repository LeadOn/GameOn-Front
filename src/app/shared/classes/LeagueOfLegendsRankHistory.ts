export class LeagueOfLegendsRankHistory {
  id: number = 0;
  playerId: number = 0;
  queueType: string = '';
  tier: string = '';
  rank: string = '';
  leaguePoints: number = 0;
  wins: number = 0;
  losses: number = 0;
  hotStreak: boolean = false;
  veteran: boolean = false;
  freshBlood: boolean = false;
  inactive: boolean = false;
  createdOn: Date = new Date();
}
