import { Player } from '../common/Player';
import { TournamentPlayerDto } from './TournamentPlayerDto';

export class Tournament {
  id: number = 0;
  name: string = 'UNKNOWN';
  description: string = 'UNKNOWN';
  state: number = 0;
  phase2ChallongeUrl?: string;
  plannedFrom: Date = new Date();
  plannedTo: Date = new Date();
  players: TournamentPlayerDto[] = [];
  winnerId?: number;
  winner?: Player;
  rules?: string;
  winPoints: number = 0;
  loosePoints: number = 0;
  drawPoints: number = 0;
  featured: boolean = false;
  phaseOneDoubleRound: boolean = false;
}
