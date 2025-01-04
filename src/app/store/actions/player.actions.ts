import { createAction, props } from '@ngrx/store';
import { PlatformStatsDto } from '../../shared/classes/PlatformStatsDto';
import { Player } from '../../shared/classes/common/Player';

export const setPlayer = createAction(
  'Set Player',
  props<{ player: Player }>()
);

export const setPlayerStats = createAction(
  'Set Player Stats',
  props<{ globalStats: PlatformStatsDto }>()
);
