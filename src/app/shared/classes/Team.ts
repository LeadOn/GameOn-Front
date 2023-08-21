import { Player } from "./Player";

export class Team {
  id: number = 0;
  fifaTeamId: number = 0;
  code: string = "";
  score: number = 0;
  players: Player[] = [];
}
