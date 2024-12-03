import { Player } from './Player';

export class FifaTeamDto {
  id: number = 0;
  fifaTeamId: number = 0;
  score: number = 0;
  players: Player[] = [];
}
