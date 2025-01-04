import { createReducer, on } from '@ngrx/store';
import { setPlayer, setPlayerStats } from '../actions/player.actions';
import { Player } from '../../shared/classes/common/Player';
import { PlatformStatsDto } from '../../shared/classes/common/PlatformStatsDto';

export const initialState: Player = new Player();
export const initialStatsState: PlatformStatsDto = new PlatformStatsDto();

export const playerReducer = createReducer(
  initialState,
  on(setPlayer, (state, { player }) => player)
);

export const playerStatsReducer = createReducer(
  initialStatsState,
  on(setPlayerStats, (state, { globalStats }) => globalStats)
);
