import { LeagueOfLegendsRankHistory } from './LeagueOfLegendsRankHistory';
import { Tournament } from './Tournament';

export class PlayerDto {
  id: number = 0;
  keycloakId?: string;
  fullName: string = '';
  nickname: string = '';
  profilePictureUrl: string = 'assets/img/gameon-logo.webp';
  createdOn: Date = new Date();
  archived: boolean = false;
  tournamentsWon?: Tournament[];
  riotGamesNickname?: string;
  riotGamesTagLine?: string;
  riotGamesPUUID?: string;
  lolSummonerId?: string;
  lolSummonerLevel?: string;
  lolRefreshedOn?: Date;
  leagueOfLegendsSoloRank?: LeagueOfLegendsRankHistory;
  leagueOfLegendsFlexRank?: LeagueOfLegendsRankHistory;
}
