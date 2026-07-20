import { LoLGameTimelineEvent } from './LoLGameTimelineEvent';

export interface MapStructure {
  key: string;
  teamId: number;
  label: string;
  isInhibitor: boolean;
  positionX: number;
  positionY: number;
}

function buildingKey(
  teamId: number | null | undefined,
  buildingType: string | null | undefined,
  laneType: string | null | undefined,
  towerType: string | null | undefined,
): string {
  return `${teamId ?? ''}|${buildingType ?? ''}|${laneType ?? ''}|${towerType ?? ''}`;
}

export function structureKeyForEvent(event: LoLGameTimelineEvent): string {
  return buildingKey(
    event.teamId,
    event.buildingType,
    event.laneType,
    event.towerType,
  );
}

/**
 * Summoner's Rift (map11) structure coordinates in Riot's raw world-position units.
 * Sourced empirically from real BUILDING_KILL events aggregated across 12 synced
 * ranked matches (queues 420/440) — every entry below matched exactly (down to the
 * unit) across every match that destroyed it, confirming these are fixed positions,
 * not derived/guessed. The two entries marked ESTIMATED were never destroyed in the
 * sample (red team's top-lane base turret & inhibitor); they're derived from the
 * map's point symmetry, cross-checked against the other 12 real mirrored pairs to
 * within ~0.2% (center of symmetry ≈ (7411, 7460) on both axes).
 */
export const MAP_STRUCTURES: MapStructure[] = [
  // Team 100 (blue side)
  {
    key: buildingKey(100, 'TOWER_BUILDING', 'TOP_LANE', 'OUTER_TURRET'),
    teamId: 100,
    label: 'Tourelle extérieure Top',
    isInhibitor: false,
    positionX: 981,
    positionY: 10441,
  },
  {
    key: buildingKey(100, 'TOWER_BUILDING', 'TOP_LANE', 'INNER_TURRET'),
    teamId: 100,
    label: 'Tourelle intérieure Top',
    isInhibitor: false,
    positionX: 1512,
    positionY: 6699,
  },
  {
    key: buildingKey(100, 'TOWER_BUILDING', 'TOP_LANE', 'BASE_TURRET'),
    teamId: 100,
    label: 'Tourelle de base Top',
    isInhibitor: false,
    positionX: 1169,
    positionY: 4287,
  },
  {
    key: buildingKey(100, 'INHIBITOR_BUILDING', 'TOP_LANE', null),
    teamId: 100,
    label: 'Inhibiteur Top',
    isInhibitor: true,
    positionX: 1172,
    positionY: 3583,
  },
  {
    key: buildingKey(100, 'TOWER_BUILDING', 'MID_LANE', 'OUTER_TURRET'),
    teamId: 100,
    label: 'Tourelle extérieure Mid',
    isInhibitor: false,
    positionX: 5846,
    positionY: 6396,
  },
  {
    key: buildingKey(100, 'TOWER_BUILDING', 'MID_LANE', 'INNER_TURRET'),
    teamId: 100,
    label: 'Tourelle intérieure Mid',
    isInhibitor: false,
    positionX: 5048,
    positionY: 4812,
  },
  {
    key: buildingKey(100, 'TOWER_BUILDING', 'MID_LANE', 'BASE_TURRET'),
    teamId: 100,
    label: 'Tourelle de base Mid',
    isInhibitor: false,
    positionX: 3651,
    positionY: 3696,
  },
  {
    key: buildingKey(100, 'INHIBITOR_BUILDING', 'MID_LANE', null),
    teamId: 100,
    label: 'Inhibiteur Mid',
    isInhibitor: true,
    positionX: 3210,
    positionY: 3217,
  },
  {
    key: buildingKey(100, 'TOWER_BUILDING', 'BOT_LANE', 'OUTER_TURRET'),
    teamId: 100,
    label: 'Tourelle extérieure Bot',
    isInhibitor: false,
    positionX: 10504,
    positionY: 1029,
  },
  {
    key: buildingKey(100, 'TOWER_BUILDING', 'BOT_LANE', 'INNER_TURRET'),
    teamId: 100,
    label: 'Tourelle intérieure Bot',
    isInhibitor: false,
    positionX: 6919,
    positionY: 1483,
  },
  {
    key: buildingKey(100, 'TOWER_BUILDING', 'BOT_LANE', 'BASE_TURRET'),
    teamId: 100,
    label: 'Tourelle de base Bot',
    isInhibitor: false,
    positionX: 4281,
    positionY: 1253,
  },
  {
    key: buildingKey(100, 'INHIBITOR_BUILDING', 'BOT_LANE', null),
    teamId: 100,
    label: 'Inhibiteur Bot',
    isInhibitor: true,
    positionX: 3468,
    positionY: 1230,
  },
  {
    key: buildingKey(100, 'TOWER_BUILDING', 'MID_LANE', 'NEXUS_TURRET'),
    teamId: 100,
    label: 'Tourelle du nexus',
    isInhibitor: false,
    positionX: 1748,
    positionY: 2270,
  },
  {
    key: buildingKey(100, 'TOWER_BUILDING', 'MID_LANE', 'NEXUS_TURRET'),
    teamId: 100,
    label: 'Tourelle du nexus',
    isInhibitor: false,
    positionX: 2177,
    positionY: 1807,
  },

  // Team 200 (red side)
  {
    key: buildingKey(200, 'TOWER_BUILDING', 'TOP_LANE', 'OUTER_TURRET'),
    teamId: 200,
    label: 'Tourelle extérieure Top',
    isInhibitor: false,
    positionX: 4318,
    positionY: 13875,
  },
  {
    key: buildingKey(200, 'TOWER_BUILDING', 'TOP_LANE', 'INNER_TURRET'),
    teamId: 200,
    label: 'Tourelle intérieure Top',
    isInhibitor: false,
    positionX: 7943,
    positionY: 13411,
  },
  {
    // ESTIMATED — never destroyed in the sample, derived from map point symmetry
    key: buildingKey(200, 'TOWER_BUILDING', 'TOP_LANE', 'BASE_TURRET'),
    teamId: 200,
    label: 'Tourelle de base Top',
    isInhibitor: false,
    positionX: 10541,
    positionY: 13667,
  },
  {
    // ESTIMATED — never destroyed in the sample, derived from map point symmetry
    key: buildingKey(200, 'INHIBITOR_BUILDING', 'TOP_LANE', null),
    teamId: 200,
    label: 'Inhibiteur Top',
    isInhibitor: true,
    positionX: 11354,
    positionY: 13690,
  },
  {
    key: buildingKey(200, 'TOWER_BUILDING', 'MID_LANE', 'OUTER_TURRET'),
    teamId: 200,
    label: 'Tourelle extérieure Mid',
    isInhibitor: false,
    positionX: 8955,
    positionY: 8510,
  },
  {
    key: buildingKey(200, 'TOWER_BUILDING', 'MID_LANE', 'INNER_TURRET'),
    teamId: 200,
    label: 'Tourelle intérieure Mid',
    isInhibitor: false,
    positionX: 9767,
    positionY: 10113,
  },
  {
    key: buildingKey(200, 'TOWER_BUILDING', 'MID_LANE', 'BASE_TURRET'),
    teamId: 200,
    label: 'Tourelle de base Mid',
    isInhibitor: false,
    positionX: 11134,
    positionY: 11207,
  },
  {
    key: buildingKey(200, 'INHIBITOR_BUILDING', 'MID_LANE', null),
    teamId: 200,
    label: 'Inhibiteur Mid',
    isInhibitor: true,
    positionX: 11593,
    positionY: 11669,
  },
  {
    key: buildingKey(200, 'TOWER_BUILDING', 'BOT_LANE', 'OUTER_TURRET'),
    teamId: 200,
    label: 'Tourelle extérieure Bot',
    isInhibitor: false,
    positionX: 13866,
    positionY: 4505,
  },
  {
    key: buildingKey(200, 'TOWER_BUILDING', 'BOT_LANE', 'INNER_TURRET'),
    teamId: 200,
    label: 'Tourelle intérieure Bot',
    isInhibitor: false,
    positionX: 13327,
    positionY: 8226,
  },
  {
    key: buildingKey(200, 'TOWER_BUILDING', 'BOT_LANE', 'BASE_TURRET'),
    teamId: 200,
    label: 'Tourelle de base Bot',
    isInhibitor: false,
    positionX: 13624,
    positionY: 10572,
  },
  {
    key: buildingKey(200, 'INHIBITOR_BUILDING', 'BOT_LANE', null),
    teamId: 200,
    label: 'Inhibiteur Bot',
    isInhibitor: true,
    positionX: 13599,
    positionY: 11319,
  },
  {
    key: buildingKey(200, 'TOWER_BUILDING', 'MID_LANE', 'NEXUS_TURRET'),
    teamId: 200,
    label: 'Tourelle du nexus',
    isInhibitor: false,
    positionX: 13052,
    positionY: 12612,
  },
  {
    key: buildingKey(200, 'TOWER_BUILDING', 'MID_LANE', 'NEXUS_TURRET'),
    teamId: 200,
    label: 'Tourelle du nexus',
    isInhibitor: false,
    positionX: 12611,
    positionY: 13084,
  },
];
