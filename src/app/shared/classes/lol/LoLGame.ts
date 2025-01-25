import { LoLGameParticipant } from './LoLGameParticipant';

export class LoLGame {
  gameId: number = 0;
  matchId: string = '';
  endOfGameResult: string = '';
  gameVersion: string = '';
  retrievedOn: Date = new Date();
  leagueOfLegendsGameParticipants: LoLGameParticipant[] = [];
  winningTeamId: number = 0;
  gameStart: Date = new Date();
  gameEnd: Date = new Date();
}
