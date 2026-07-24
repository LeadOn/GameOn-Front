export class LoLGameParticipantStats {
  gameDurationSeconds: number = 0;
  kda: number = 0;
  killParticipationPercent: number = 0;
  creepScore: number = 0;
  csPerMinute: number = 0;
  goldEarned: number = 0;
  goldPerMinute: number = 0;
  damageDealtToChampions: number = 0;
  damagePerMinute: number = 0;
  damageTaken: number = 0;
  wardsPlaced: number = 0;
  wardsKilled: number = 0;
  computedOn: Date = new Date();
}
