import { Player } from '../common/Player';

export interface LoLFunStatDto {
  player: Player | null;
  value: number;
  detail: string | null;
  matchId: string | null;
  gameDate: string | null;
}

export interface LoLGlobalStatsDto {
  totalGamesAnalyzed: number;
  totalPlayersTracked: number;
  pingMachine: LoLFunStatDto | null;
  biggestInter: LoLFunStatDto | null;
  highestBounty: LoLFunStatDto | null;
  shoppingAddict: LoLFunStatDto | null;
  oneTrickPony: LoLFunStatDto | null;
  crowdControlMaster: LoLFunStatDto | null;
  punchingBall: LoLFunStatDto | null;
  pacifist: LoLFunStatDto | null;
  squirrel: LoLFunStatDto | null;
  jungleThief: LoLFunStatDto | null;
  comebackKing: LoLFunStatDto | null;
  nightOwl: LoLFunStatDto | null;
  longestLossStreak: LoLFunStatDto | null;
  emotionalElevator: LoLFunStatDto | null;
  cursedPatch: LoLFunStatDto | null;
}

export type LoLQueueFilter = 'All' | 'Solo' | 'Flex';

export type LoLStatsPeriod =
  'AllTime' | 'Week' | 'Month' | 'ThreeMonths' | 'SixMonths';

export interface GlobalStatsFilters {
  rankedOnly?: boolean;
  queue?: LoLQueueFilter;
  period?: LoLStatsPeriod;
}

export type LoLGlobalStatAwardKey =
  | 'pingMachine'
  | 'biggestInter'
  | 'highestBounty'
  | 'shoppingAddict'
  | 'oneTrickPony'
  | 'crowdControlMaster'
  | 'punchingBall'
  | 'pacifist'
  | 'squirrel'
  | 'jungleThief'
  | 'comebackKing'
  | 'nightOwl'
  | 'longestLossStreak'
  | 'emotionalElevator'
  | 'cursedPatch';
