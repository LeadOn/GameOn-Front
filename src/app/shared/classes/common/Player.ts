import { Tournament } from '../fifa/Tournament';

export class Player {
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
  lolIconId?: number;
  lolSummonerLevel?: string;
  lolRefreshedOn?: Date;
}
