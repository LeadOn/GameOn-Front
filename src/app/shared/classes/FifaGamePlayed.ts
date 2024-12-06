import { Highlight } from './Highlight';
import { FifaTeamDto } from './FifaTeamDto';
import { Season } from './Season';

export class FifaGamePlayed {
  id: number = 0;
  playedOn: Date = new Date();
  platform: string = '';
  platformId: number = 0;
  team1: FifaTeamDto = new FifaTeamDto();
  team2: FifaTeamDto = new FifaTeamDto();
  highlights: Highlight[] = [];
  season: Season = new Season();
  isPlayed = false;
  tournamentId?: number;
  phase?: number;
}
