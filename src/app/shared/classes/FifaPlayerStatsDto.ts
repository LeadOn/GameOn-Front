import { PlatformStatsDto } from './common/PlatformStatsDto';
import { TopTeamStatDto } from './TopTeamStatDto';

export class FifaPlayerStatsDto {
  statsPerPlatform: PlatformStatsDto[] = [];
  mostPlayedTeams: TopTeamStatDto[] = [];
  mostWinsTeams: TopTeamStatDto[] = [];
  mostLossesTeams: TopTeamStatDto[] = [];
}
