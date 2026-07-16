import { LoLGameParticipant } from './LoLGameParticipant';

export class LoLGame {
  gameId: number = 0;
  matchId: string = '';
  endOfGameResult: string = '';
  gameVersion: string = '';
  retrievedOn: Date = new Date();
  leagueOfLegendsGameParticipants: LoLGameParticipant[] = [];
  winningTeamId: number | null = 0;
  gameStart: Date = new Date();
  gameEnd: Date = new Date();
  queueId: number | null = null;
  queueType: string = '';
  isRemake: boolean = false;
}
