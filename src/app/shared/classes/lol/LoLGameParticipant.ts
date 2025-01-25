import { Player } from '../common/Player';

export class LoLGameParticipant {
  id: number = 0;
  playerId?: number;
  player?: Player;
  matchId: string = '';
  puuid?: string;
  riotIdTagLine?: string;
  riotIdGameName?: string;
  championId?: number;
  championName?: string;
  champLevel?: number;
  kills: number = 0;
  deaths: number = 0;
  assists: number = 0;
  teamId: number = 0;
  item0: number = 0;
  item1: number = 0;
  item2: number = 0;
  item3: number = 0;
  item4: number = 0;
  item5: number = 0;
  item6: number = 0;
  win?: boolean;
}
