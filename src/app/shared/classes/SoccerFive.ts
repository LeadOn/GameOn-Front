import { Player } from './Player';

export class SoccerFive {
  id: number = 0;
  name?: string;
  description?: string;
  createdById: number = 0;
  plannedOn?: Date;
  state: number = 0;
  createdBy: Player = new Player();
}
