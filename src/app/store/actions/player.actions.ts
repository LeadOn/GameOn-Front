import { createAction, props } from "@ngrx/store";
import { Player } from "src/app/shared/classes/Player";

export const setPlayer = createAction(
  "Set Player",
  props<{ player: Player }>()
);
