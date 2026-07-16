import { createReducer, on } from '@ngrx/store';
import { setLoLQueues, setLoLVersion } from '../actions/lol.actions';
import { LoLQueue } from '../../../shared/classes/lol/LoLQueue';

export const initialState: string = '';

export const lolVersionReducer = createReducer(
  initialState,
  on(setLoLVersion, (state, { version }) => version),
);

export const initialQueuesState: LoLQueue[] = [];

export const lolQueuesReducer = createReducer(
  initialQueuesState,
  on(setLoLQueues, (state, { queues }) => queues),
);
