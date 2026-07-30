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
  /**
   * 0-10 post-game grade Riot-side logic uses to pick `LoLGame.mvpParticipantId`
   * / `aceParticipantId` — not consumed directly by the front (see
   * `playerRating` in lol-match.util.ts for the front's own, unrelated 0-10
   * grade). NOT NULL, defaults to 0 until a participant is (re)computed by
   * this migration, ambiguous with a genuinely low rating.
   */
  rating: number = 0;
  /**
   * NOT NULL, defaults to 0 until (re)computed — ambiguous with "no damage of
   * this type dealt". `damageSplitFor` in lol-match.util.ts treats a
   * physical+magic+true sum of 0 as "not backfilled" and falls back to the
   * timeline instead of trusting it as a real all-zero split.
   */
  physicalDamageToChampions: number = 0;
  magicDamageToChampions: number = 0;
  trueDamageToChampions: number = 0;
  /** Same NOT NULL/default-0 caveat as the damage split fields above. */
  timeCcOthersSeconds: number = 0;
}
