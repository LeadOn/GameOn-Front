import { LoLGameParticipant } from './LoLGameParticipant';
import { LoLGameTimelineEvent } from './LoLGameTimelineEvent';
import { LoLGameTimelineFrame } from './LoLGameTimelineFrame';
import { formatTimestamp } from './lol-match.util';
import { allTimelineEvents, findByPuuid } from './lol-timeline-event.util';

export type KeyMomentTone = 'red' | 'blue' | 'yellow' | 'green';

export interface KeyMoment {
  key: string;
  icon: string;
  title: string;
  detail: string;
  timestamp: number;
  timeLabel: string;
  tone: KeyMomentTone;
}

/**
 * `DRAGON_SOUL_GIVEN.dragonSoulType` uses short names ("Ocean") rather than
 * the `ELITE_MONSTER_KILL` subtype constants ("WATER_DRAGON"), so it needs its
 * own lookup.
 */
const SOUL_LABELS: Record<string, string> = {
  Cloud: 'des Nuées',
  Infernal: 'Infernale',
  Mountain: 'Montagneuse',
  Ocean: 'Océanique',
  Chemtech: 'Chimtech',
  Hextech: 'Hextech',
};

const MULTI_KILL_TITLES: Record<number, string> = {
  3: 'Triple kill',
  4: 'Quadra kill',
  5: 'Penta kill',
};

function playerName(
  players: LoLGameParticipant[],
  puuid?: string | null,
): string {
  return findByPuuid(players, puuid)?.championName ?? 'Inconnu';
}

function teamLabel(teamId?: number | null): string {
  if (teamId === 100) return "l'équipe bleue";
  if (teamId === 200) return "l'équipe rouge";
  return "l'équipe";
}

function moment(
  key: string,
  icon: string,
  title: string,
  detail: string,
  timestamp: number,
  tone: KeyMomentTone,
): KeyMoment {
  return {
    key,
    icon,
    title,
    detail,
    timestamp,
    timeLabel: formatTimestamp(timestamp),
    tone,
  };
}

/**
 * The handful of events that tell the story of the match, in priority order:
 * only the first `limit` that actually happened are kept (a game with no Baron
 * or no Ace falls through to the dragon soul, the best multi-kill, ...), and
 * they're returned chronologically for display.
 *
 * Everything is timeline-derived, so this is empty on games that were never
 * synced. `winningTeamId` comes from the match itself because Riot's
 * `GAME_END` event carries no team.
 */
export function keyMoments(
  timeline: LoLGameTimelineFrame[] | undefined,
  players: LoLGameParticipant[],
  winningTeamId: number | null,
  limit = 4,
): KeyMoment[] {
  const events = allTimelineEvents(timeline);

  if (events.length === 0) {
    return [];
  }

  const first = (predicate: (event: LoLGameTimelineEvent) => boolean) =>
    events.find(predicate);

  const candidates: KeyMoment[] = [];

  const firstBlood = first((e) => e.eventType === 'CHAMPION_KILL');
  if (firstBlood != null) {
    candidates.push(
      moment(
        'first-blood',
        '🩸',
        'Premier sang',
        `${playerName(players, firstBlood.killerPUUID)} élimine ${playerName(players, firstBlood.victimPUUID)}`,
        firstBlood.timestamp,
        'red',
      ),
    );
  }

  const ace = first(
    (e) => e.eventType === 'CHAMPION_SPECIAL_KILL' && e.killType === 'KILL_ACE',
  );
  if (ace != null) {
    const killer = findByPuuid(players, ace.killerPUUID);
    const opponents = players.filter(
      (p) => killer != null && p.teamId !== killer.teamId,
    ).length;
    candidates.push(
      moment(
        'ace',
        '💥',
        'Ace',
        `${playerName(players, ace.killerPUUID)} conclut, ${opponents} adversaires à terre`,
        ace.timestamp,
        'blue',
      ),
    );
  }

  const baron = first(
    (e) =>
      e.eventType === 'ELITE_MONSTER_KILL' && e.monsterType === 'BARON_NASHOR',
  );
  if (baron != null) {
    const baronTeam =
      baron.killerTeamId === 100 || baron.killerTeamId === 200
        ? baron.killerTeamId
        : findByPuuid(players, baron.killerPUUID)?.teamId;
    candidates.push(
      moment(
        'baron',
        '🔮',
        'Baron Nashor',
        `Sécurisé par ${playerName(players, baron.killerPUUID)} — ${teamLabel(baronTeam)}`,
        baron.timestamp,
        'yellow',
      ),
    );
  }

  const gameEnd = first((e) => e.eventType === 'GAME_END');
  if (gameEnd != null && winningTeamId != null) {
    candidates.push(
      moment(
        'game-end',
        '🏰',
        'Nexus détruit',
        `${teamLabel(winningTeamId)} l'emporte`,
        gameEnd.timestamp,
        'green',
      ),
    );
  }

  const soul = first(
    (e) =>
      e.eventType === 'DRAGON_SOUL_GIVEN' &&
      (e.teamId === 100 || e.teamId === 200),
  );
  if (soul != null) {
    const soulLabel = soul.dragonSoulType
      ? (SOUL_LABELS[soul.dragonSoulType] ?? soul.dragonSoulType)
      : '';
    candidates.push(
      moment(
        'dragon-soul',
        '👑',
        `Âme ${soulLabel}`.trim(),
        `${teamLabel(soul.teamId)} obtient l'âme du dragon`,
        soul.timestamp,
        'yellow',
      ),
    );
  }

  const bestMulti = events
    .filter(
      (e) =>
        e.eventType === 'CHAMPION_SPECIAL_KILL' &&
        e.killType === 'KILL_MULTI' &&
        (e.multiKillLength ?? 0) >= 3,
    )
    .sort((a, b) => (b.multiKillLength ?? 0) - (a.multiKillLength ?? 0))[0];
  if (bestMulti != null) {
    const length = bestMulti.multiKillLength ?? 3;
    candidates.push(
      moment(
        'multi-kill',
        '🔥',
        MULTI_KILL_TITLES[length] ?? `${length}x kill`,
        `${playerName(players, bestMulti.killerPUUID)} enchaîne ${length} éliminations`,
        bestMulti.timestamp,
        'red',
      ),
    );
  }

  const dragon = first(
    (e) => e.eventType === 'ELITE_MONSTER_KILL' && e.monsterType === 'DRAGON',
  );
  if (dragon != null) {
    const dragonTeam =
      dragon.killerTeamId === 100 || dragon.killerTeamId === 200
        ? dragon.killerTeamId
        : findByPuuid(players, dragon.killerPUUID)?.teamId;
    candidates.push(
      moment(
        'first-dragon',
        '🐉',
        'Premier dragon',
        `Pris par ${playerName(players, dragon.killerPUUID)} — ${teamLabel(dragonTeam)}`,
        dragon.timestamp,
        'blue',
      ),
    );
  }

  const tower = first(
    (e) =>
      e.eventType === 'BUILDING_KILL' && e.buildingType === 'TOWER_BUILDING',
  );
  if (tower != null) {
    // `teamId` is the side that *lost* the tower.
    const takerTeam = tower.teamId === 100 ? 200 : 100;
    candidates.push(
      moment(
        'first-tower',
        '🏰',
        'Première tourelle',
        `${teamLabel(takerTeam)} ouvre la carte`,
        tower.timestamp,
        'green',
      ),
    );
  }

  return candidates.slice(0, limit).sort((a, b) => a.timestamp - b.timestamp);
}
