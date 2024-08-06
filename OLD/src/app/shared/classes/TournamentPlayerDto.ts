import { FifaTeam } from "./FifaTeam";
import { PlatformStatsDto } from "./PlatformStatsDto";
import { Player } from "./Player";

export class TournamentPlayerDto {
  player: Player = new Player();
  team: FifaTeam = new FifaTeam();
  stats: PlatformStatsDto = new PlatformStatsDto();
  joinedAt: Date = new Date();
  score: number = 0;
}
