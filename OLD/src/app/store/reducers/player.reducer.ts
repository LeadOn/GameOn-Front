import { createReducer, on } from "@ngrx/store";
import { setPlayer } from "../actions/player.actions";
import { Player } from "src/app/shared/classes/Player";

export const initialState: Player = new Player();

export const playerReducer = createReducer(
  initialState,
  on(setPlayer, (state, { player }) => player)
);
