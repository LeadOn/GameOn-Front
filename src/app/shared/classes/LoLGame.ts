import { LoLGameParticipant } from './LoLGameParticipant';

export class LoLGame {
  gameId: number = 0;
  matchId: string = '';
  endOfGameResult: string = '';
  gameVersion: string = '';
  retrievedOn: Date = new Date();
  leagueOfLegendsGameParticipants: LoLGameParticipant[] = [];
}
