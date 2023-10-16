import { TournamentPlayerDto } from "./TournamentPlayerDto";

export class Tournament {
  id: number = 0;
  name: string = "UNKNOWN";
  description?: string;
  state: number = 0;
  logoUrl?: string;
  phase2ChallongeUrl?: string;
  plannedFrom: Date = new Date();
  plannedTo: Date = new Date();
  players: TournamentPlayerDto[] = [];
}
