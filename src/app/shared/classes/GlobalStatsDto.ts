import { Player } from './common/Player';
import { FifaPlayerStatsDto } from './FifaPlayerStatsDto';

export class GlobalStatsDto {
  numberOfGames: number = 0;
  bestPlayer: Player = new Player();
  bestPlayerStats: FifaPlayerStatsDto = new FifaPlayerStatsDto();
  worstPlayer: Player = new Player();
  worstPlayerStats: FifaPlayerStatsDto = new FifaPlayerStatsDto();
}
