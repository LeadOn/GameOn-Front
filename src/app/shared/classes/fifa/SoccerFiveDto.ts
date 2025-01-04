import { Player } from '../common/Player';
import { SoccerFiveVoteChoice } from '../SoccerFiveVoteChoice';

export class SoccerFiveDto {
  id: number = 0;
  name?: string;
  description?: string;
  plannedOn?: Date;
  state: number = 0;
  createdBy: Player = new Player();
  voteQuestion?: string;
  votesChoices?: SoccerFiveVoteChoice[];
}
