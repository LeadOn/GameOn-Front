import { Player } from './Player';
import { SoccerFiveVoteAnswer } from './SoccerFiveVoteAnswer';

export class SoccerFiveVoteChoice {
  id: number = 0;
  soccerFiveId: number = 0;
  label: string = '';
  order: number = 0;
  answers?: SoccerFiveVoteAnswer[];
  voteStatus: boolean = false;
  percentage: number = 0;
}
