import { Tournament } from '../fifa/Tournament';
import { LeagueOfLegendsRankHistory } from '../lol/LeagueOfLegendsRankHistory';

export class PlayerDto {
  id: number = 0;
  keycloakId?: string;
  fullName: string = '';
  nickname: string = '';
  profilePictureUrl: string = 'default.webp';
  createdOn: Date = new Date();
  archived: boolean = false;
  tournamentsWon?: Tournament[];
  riotGamesNickname?: string;
  riotGamesTagLine?: string;
  riotGamesPUUID?: string;
  lolSummonerId?: string;
  lolSummonerLevel?: string;
  lolRefreshedOn?: Date;
  lolIconId?: number;
  leagueOfLegendsSoloRank?: LeagueOfLegendsRankHistory;
  leagueOfLegendsFlexRank?: LeagueOfLegendsRankHistory;
}
