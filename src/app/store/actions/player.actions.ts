import { createAction, props } from '@ngrx/store';
import { Player } from '../../shared/classes/Player';
import { PlatformStatsDto } from '../../shared/classes/PlatformStatsDto';

export const setPlayer = createAction(
  'Set Player',
  props<{ player: Player }>()
);

export const setPlayerStats = createAction(
  'Set Player Stats',
  props<{ globalStats: PlatformStatsDto }>()
);
