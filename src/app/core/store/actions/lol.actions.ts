import { createAction, props } from '@ngrx/store';

export const setLoLVersion = createAction(
  'Set League of Legends Version',
  props<{ version: string }>(),
);
