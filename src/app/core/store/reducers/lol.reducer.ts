import { createReducer, on } from '@ngrx/store';
import {
  setLoLQueues,
  setLoLVersion,
  setLoLVersions,
} from '../actions/lol.actions';
import { LoLQueue } from '../../../shared/classes/lol/LoLQueue';

export const initialState: string = '';

export const lolVersionReducer = createReducer(
  initialState,
  on(setLoLVersion, (state, { version }) => version),
);

export const initialVersionsState: string[] = [];

export const lolVersionsReducer = createReducer(
  initialVersionsState,
  on(setLoLVersions, (state, { versions }) => versions),
);

export const initialQueuesState: LoLQueue[] = [];

export const lolQueuesReducer = createReducer(
  initialQueuesState,
  on(setLoLQueues, (state, { queues }) => queues),
);
