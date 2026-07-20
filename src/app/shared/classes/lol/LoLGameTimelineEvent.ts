import { LoLGameTimelineEventAssist } from './LoLGameTimelineEventAssist';

/**
 * Every field below except id/matchId/timestamp/eventType is nullable —
 * which ones are populated depends entirely on eventType (see lol-timeline-event.util.ts).
 */
export class LoLGameTimelineEvent {
  id: number = 0;
  loLGameTimelineFrameId: number = 0;
  matchId: string = '';
  timestamp: number = 0;
  realTimestamp: number | null = null;
  eventType: string = '';

  // CHAMPION_KILL / CHAMPION_SPECIAL_KILL / BUILDING_KILL / TURRET_PLATE_DESTROYED / ELITE_MONSTER_KILL
  killerId: number | null = null;
  killerPUUID: string | null = null;
  positionX: number | null = null;
  positionY: number | null = null;

  // CHAMPION_KILL
  victimId: number | null = null;
  victimPUUID: string | null = null;
  bounty: number | null = null;
  shutdownBounty: number | null = null;
  killStreakLength: number | null = null;
  loLGameTimelineEventAssists: LoLGameTimelineEventAssist[] = [];

  // CHAMPION_SPECIAL_KILL
  killType: string | null = null;
  multiKillLength: number | null = null;

  // WARD_PLACED / WARD_KILL
  creatorId: number | null = null;
  creatorPUUID: string | null = null;
  wardType: string | null = null;

  // ITEM_PURCHASED / ITEM_SOLD / ITEM_DESTROYED / ITEM_UNDO / SKILL_LEVEL_UP / LEVEL_UP
  participantId: number | null = null;
  participantPUUID: string | null = null;
  itemId: number | null = null;
  beforeId: number | null = null;
  afterId: number | null = null;
  goldGain: number | null = null;
  skillSlot: number | null = null;
  levelUpType: string | null = null;
  level: number | null = null;

  // BUILDING_KILL / TURRET_PLATE_DESTROYED
  teamId: number | null = null;
  buildingType: string | null = null;
  towerType: string | null = null;
  laneType: string | null = null;

  // ELITE_MONSTER_KILL
  killerTeamId: number | null = null;
  monsterType: string | null = null;
  monsterSubType: string | null = null;

  // CHAMPION_TRANSFORM
  transformType: string | null = null;

  // DRAGON_SOUL_GIVEN
  dragonSoulType: string | null = null;
}
