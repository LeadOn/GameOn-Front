import { FifaTeam } from "./FifaTeam";
import { Player } from "./Player";

export class TournamentPlayerDto {
  player: Player = new Player();
  team: FifaTeam = new FifaTeam();
  joinedAt: Date = new Date();
}
