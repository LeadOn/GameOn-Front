import { Player } from './Player';

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
  teamId: number = 0;
}
