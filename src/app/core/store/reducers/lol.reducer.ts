import { createReducer, on } from '@ngrx/store';
import { setLoLVersion } from '../actions/lol.actions';

export const initialState: string = '';

export const lolVersionReducer = createReducer(
  initialState,
  on(setLoLVersion, (state, { version }) => version),
);
