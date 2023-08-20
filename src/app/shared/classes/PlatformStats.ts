import { Platform } from "./Platform";

export class PlatformStats {
  platform: Platform = new Platform();
  wins: number = 0;
  losses: number = 0;
  draws: number = 0;
  averageGoalGiven: number = 0;
  averageGoalTaken: number = 0;
  goalsGiven: number = 0;
  goalsTaken: number = 0;
  goalDifference: number = 0;

  winRate: number = 0;
  looseRate: number = 0;
  drawRate: number = 0;
}
