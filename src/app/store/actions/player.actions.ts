import { createAction, props } from '@ngrx/store';
import { Player } from '../../shared/classes/common/Player';
import { PlatformStatsDto } from '../../shared/classes/common/PlatformStatsDto';

export const setPlayer = createAction(
  'Set Player',
  props<{ player: Player }>()
);

export const setPlayerStats = createAction(
  'Set Player Stats',
  props<{ globalStats: PlatformStatsDto }>()
);
