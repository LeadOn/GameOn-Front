import { Player } from '../common/Player';

export class FifaTeamDto {
  id: number = 0;
  fifaTeamId: number = 0;
  score: number = 0;
  players: Player[] = [];
}
