import { createAction, props } from '@ngrx/store';
import { LoLQueue } from '../../../shared/classes/lol/LoLQueue';

export const setLoLVersion = createAction(
  'Set League of Legends Version',
  props<{ version: string }>(),
);

export const setLoLQueues = createAction(
  'Set League of Legends Queues',
  props<{ queues: LoLQueue[] }>(),
);
