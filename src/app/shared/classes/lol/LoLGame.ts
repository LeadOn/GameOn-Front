import { LoLGameParticipant } from './LoLGameParticipant';
import { LoLGameTeam } from './LoLGameTeam';

export class LoLGame {
  gameId: number = 0;
  matchId: string = '';
  endOfGameResult: string = '';
  gameVersion: string = '';
  retrievedOn: Date = new Date();
  leagueOfLegendsGameParticipants: LoLGameParticipant[] = [];
  leagueOfLegendsGameTeams: LoLGameTeam[] = [];
  winningTeamId: number | null = 0;
  gameStart: Date = new Date();
  gameEnd: Date = new Date();
  queueId: number | null = null;
  isRemake: boolean = false;
  frameInterval: number = 60000;
  /**
   * Participant `id` of the best-rated player on the winning team / worst-hit
   * best-rated player on the losing team, computed server-side from `stats.rating`.
   * Null on remakes, games with no winning team, or when ratings aren't (yet)
   * computable — not to be confused with `stats.rating` defaulting to 0, which
   * is ambiguous between "unbackfilled" and "a genuine 0". These two fields
   * carry no such ambiguity: null unambiguously means "not computed".
   */
  mvpParticipantId: number | null = null;
  aceParticipantId: number | null = null;
}
