import { PlatformStatsDto } from '../common/PlatformStatsDto';
import { Player } from '../common/Player';
import { FifaTeam } from './FifaTeam';

export class TournamentPlayerDto {
  player: Player = new Player();
  team: FifaTeam = new FifaTeam();
  stats: PlatformStatsDto = new PlatformStatsDto();
  joinedAt: Date = new Date();
  score: number = 0;
}
