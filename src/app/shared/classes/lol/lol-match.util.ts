import { LoLGame } from './LoLGame';
import { LoLGameParticipant } from './LoLGameParticipant';
import { LoLGameTimelineFrame } from './LoLGameTimelineFrame';
import { LoLGameTimelineFrameParticipant } from './LoLGameTimelineFrameParticipant';

/**
 * Prefers Riot's own `challenges.kda` (raw, unrounded) over `stats.kda` — the
 * same number pre-rounded server-side with C#'s banker's rounding, which can
 * land a cent off from this file's own `toFixed`-based rounding on `.xx5`
 * boundaries — and only falls back to a manual kills/deaths/assists ratio
 * when neither API-provided value is available (games never (re)synced).
 */
export function kda(player: LoLGameParticipant): number {
  if (player.challenges != null) {
    return player.challenges.kda;
  }

  if (player.stats != null) {
    return player.stats.kda;
  }

  const denominator = player.deaths === 0 ? 1 : player.deaths;
  return (player.kills + player.assists) / denominator;
}

export function decimalLabel(value: number, fractionDigits = 1): string {
  return value.toFixed(fractionDigits).replace('.', ',');
}

export function kdaLabel(player: LoLGameParticipant): string {
  return decimalLabel(kda(player), 2);
}

export function kdaColorClass(value: number): string {
  if (value >= 3) return 'text-mpGreenInk';
  if (value >= 2) return 'text-mpYellowInk';
  return 'text-mpTextSecondary';
}

export function itemSlots(player: LoLGameParticipant): number[] {
  return [
    player.item0,
    player.item1,
    player.item2,
    player.item3,
    player.item4,
    player.item5,
    player.item6,
  ];
}

/**
 * `LoLGame.gameVersion` is Riot's raw client version (e.g. "14.22.3434.353535"),
 * which is never itself a valid data dragon asset build. Find the data dragon
 * version (from the full `versions.json` list) whose patch (major.minor) is
 * closest to the game's own patch, so old games render assets from the
 * closest era instead of always falling back to the current patch.
 */
export function closestDdragonVersion(
  gameVersion: string,
  availableVersions: string[],
): string {
  const [gameMajor, gameMinor] = gameVersion.split('.').map(Number);

  if (
    availableVersions.length === 0 ||
    Number.isNaN(gameMajor) ||
    Number.isNaN(gameMinor)
  ) {
    return gameVersion;
  }

  const gameScore = gameMajor * 100 + gameMinor;
  let closest = availableVersions[0];
  let closestDistance = Infinity;

  for (const version of availableVersions) {
    const [major, minor] = version.split('.').map(Number);

    if (Number.isNaN(major) || Number.isNaN(minor)) {
      continue;
    }

    const distance = Math.abs(major * 100 + minor - gameScore);

    if (distance < closestDistance) {
      closestDistance = distance;
      closest = version;

      if (distance === 0) {
        break;
      }
    }
  }

  return closest;
}

export function championIconUrl(
  championName: string | undefined,
  patch: string,
): string {
  if (championName == null || championName === '') {
    return 'assets/img/gameon-logo.webp';
  }

  return `https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${championName}.png`;
}

export function itemIconUrl(itemId: number, patch: string): string {
  return `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${itemId}.png`;
}

export function latestFrame(
  timeline: LoLGameTimelineFrame[] | undefined,
): LoLGameTimelineFrame | undefined {
  if (timeline == null || timeline.length === 0) {
    return undefined;
  }

  return timeline.reduce((a, b) => (a.timestamp >= b.timestamp ? a : b));
}

export function frameStatsFor(
  frame: LoLGameTimelineFrame | undefined,
  puuid?: string,
): LoLGameTimelineFrameParticipant | undefined {
  return frame?.loLGameTimelineFrameParticipants.find(
    (p) => p.participantPUUID === puuid,
  );
}

export function latestStatsFor(
  timeline: LoLGameTimelineFrame[] | undefined,
  puuid?: string,
): LoLGameTimelineFrameParticipant | undefined {
  return frameStatsFor(latestFrame(timeline), puuid);
}

export function csFor(
  timeline: LoLGameTimelineFrame[] | undefined,
  puuid?: string,
): number {
  const stats = latestStatsFor(timeline, puuid);
  if (stats == null) {
    return 0;
  }

  return stats.minionsKilled + stats.jungleMinionsKilled;
}

export function csPerMinute(cs: number, durationSeconds: number): number {
  if (durationSeconds <= 0) {
    return 0;
  }

  return cs / (durationSeconds / 60);
}

export function teamKillCount(team: LoLGameParticipant[]): number {
  return team.reduce((sum, p) => sum + p.kills, 0);
}

export function killParticipation(
  player: LoLGameParticipant,
  team: LoLGameParticipant[],
): number {
  const total = teamKillCount(team);
  if (total === 0) {
    return 0;
  }

  return Math.round(((player.kills + player.assists) / total) * 100);
}

/**
 * Prefers the backend-computed `stats.creepScore` (available once a game has
 * been backfilled) over recalculating CS from the timeline client-side.
 */
export function creepScoreFor(
  player: LoLGameParticipant,
  timeline: LoLGameTimelineFrame[] | undefined,
): number {
  return player.stats?.creepScore ?? csFor(timeline, player.puuid);
}

export function goldEarnedFor(
  player: LoLGameParticipant,
  timeline: LoLGameTimelineFrame[] | undefined,
): number {
  return (
    player.stats?.goldEarned ??
    latestStatsFor(timeline, player.puuid)?.totalGold ??
    0
  );
}

/**
 * Team gold total from a single source per side: every member's backend
 * `stats.goldEarned` (exact end-of-game value) when the whole roster has been
 * backfilled, otherwise everyone's last timeline frame — never a mix of the
 * two, which would blend final gold with values from ~1 minute before the
 * end. When neither covers the full roster, the partial `stats` sum is the
 * only data left.
 */
export function teamGold(
  team: LoLGameParticipant[],
  timeline: LoLGameTimelineFrame[] | undefined,
): number {
  if (team.length > 0 && team.every((p) => p.stats != null)) {
    return team.reduce((sum, p) => sum + (p.stats?.goldEarned ?? 0), 0);
  }

  const frame = latestFrame(timeline);
  if (frame != null) {
    return team.reduce(
      (sum, p) => sum + (frameStatsFor(frame, p.puuid)?.totalGold ?? 0),
      0,
    );
  }

  return team.reduce((sum, p) => sum + (p.stats?.goldEarned ?? 0), 0);
}

/**
 * Same source hierarchy as {@link kda}: Riot's own `challenges.killParticipation`
 * first, then the backend-computed `stats.killParticipationPercent`, then a
 * manual recount — so every consumer (scoreboard subtitle, rating, radar,
 * performance tiles) shows the same number for the same player.
 */
export function killParticipationFor(
  player: LoLGameParticipant,
  team: LoLGameParticipant[],
): number {
  if (player.challenges != null) {
    return Math.round(player.challenges.killParticipation * 100);
  }

  return Math.round(
    player.stats?.killParticipationPercent ?? killParticipation(player, team),
  );
}

export function damageToChampionsFor(
  player: LoLGameParticipant,
  timeline: LoLGameTimelineFrame[] | undefined,
): number {
  return (
    player.stats?.damageDealtToChampions ??
    latestStatsFor(timeline, player.puuid)?.totalDamageDoneToChampions ??
    0
  );
}

export interface DamageSplit {
  physical: number;
  magic: number;
  trueDamage: number;
}

/**
 * Physical/magic/true damage-to-champions split, single source of truth for
 * the scoreboard row, damage profile panel, and damage chart. Prefers the
 * backend-computed `stats.physical/magic/trueDamageToChampions` fields, but a
 * sum of exactly 0 is treated as "not (re)backfilled yet" (see the NOT
 * NULL/default-0 caveat on `LoLGameParticipantStats`) rather than a real
 * all-zero split, falling back to the participant's last timeline frame.
 * Returns `null` when neither source has any data (never-synced games).
 */
export function damageSplitFor(
  player: LoLGameParticipant,
  timeline: LoLGameTimelineFrame[] | undefined,
): DamageSplit | null {
  const apiPhysical = player.stats?.physicalDamageToChampions ?? 0;
  const apiMagic = player.stats?.magicDamageToChampions ?? 0;
  const apiTrue = player.stats?.trueDamageToChampions ?? 0;

  if (apiPhysical + apiMagic + apiTrue > 0) {
    return { physical: apiPhysical, magic: apiMagic, trueDamage: apiTrue };
  }

  const stats = latestStatsFor(timeline, player.puuid);
  const physical = stats?.physicalDamageDoneToChampions ?? 0;
  const magic = stats?.magicDamageDoneToChampions ?? 0;
  const trueDamage = stats?.trueDamageDoneToChampions ?? 0;

  return physical + magic + trueDamage > 0
    ? { physical, magic, trueDamage }
    : null;
}

/**
 * Seconds of enemy crowd control inflicted, single source of truth for the
 * "Contrôle infligé" stat tile and the "Maître du CC" highlight. Prefers the
 * backend-computed `stats.timeCcOthersSeconds`, falling back to the
 * timeline's `timeEnemySpentControlled` (milliseconds) when it's exactly 0 —
 * same not-yet-backfilled ambiguity as {@link damageSplitFor}.
 */
export function crowdControlSecondsFor(
  player: LoLGameParticipant,
  timeline: LoLGameTimelineFrame[] | undefined,
): number {
  const apiValue = player.stats?.timeCcOthersSeconds ?? 0;
  if (apiValue > 0) {
    return Math.round(apiValue);
  }

  return Math.round(
    (latestStatsFor(timeline, player.puuid)?.timeEnemySpentControlled ?? 0) /
      1000,
  );
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/**
 * Fallback-only post-game grade, superseded by the backend's `stats.rating`
 * (see {@link ratingFor}) — but deliberately kept as an exact mirror of the
 * backend's own formula (`LoLGameParticipantStatCalculator.Compute` in
 * GameOn-API, confirmed field-for-field with the backend team), so a
 * never-resynced game still grades the same way a resynced one eventually
 * will. Deliberately absolute rather than ranked against the lobby, so the
 * same performance always grades the same: five components, each clamped to
 * [0, 1] against a fixed "excellent game" reference, then weighted, plus a
 * flat bonus for winning applied after weighting but before the final
 * [0, 10] clamp (what lets a strong, winning performance reach the 10.0 cap):
 *   - KDA / 6                          → 25%
 *   - kill participation% / 65         → 20%
 *   - share of the team's damage / 0.3 → 25%
 *   - gold/min / 500                   → 15%
 *   - 1 − deaths/12 (survival)         → 15%
 *   - + 0.4 flat if the game was won
 * Riot's own `stats`/`challenges` blocks are used when the game has been
 * synced, and recomputed from the timeline otherwise.
 */
export function playerRating(
  player: LoLGameParticipant,
  team: LoLGameParticipant[],
  timeline: LoLGameTimelineFrame[] | undefined,
  durationSeconds: number,
): number {
  const teamDamage = team.reduce(
    (sum, p) => sum + damageToChampionsFor(p, timeline),
    0,
  );
  const damageShare =
    player.challenges?.teamDamagePercentage ??
    (teamDamage > 0 ? damageToChampionsFor(player, timeline) / teamDamage : 0);

  const minutes = durationSeconds > 0 ? durationSeconds / 60 : 0;
  const goldPerMinute =
    player.stats?.goldPerMinute ??
    (minutes > 0 ? goldEarnedFor(player, timeline) / minutes : 0);

  const kdaPart = clamp01(kda(player) / 6);
  const kpPart = clamp01(killParticipationFor(player, team) / 65);
  const damagePart = clamp01(damageShare / 0.3);
  const goldPart = clamp01(goldPerMinute / 500);
  const survivalPart = clamp01(1 - player.deaths / 12);

  const rating =
    10 *
      (kdaPart * 0.25 +
        kpPart * 0.2 +
        damagePart * 0.25 +
        goldPart * 0.15 +
        survivalPart * 0.15) +
    (player.win ? 0.4 : 0);

  return Math.min(10, Math.max(0, rating));
}

/**
 * Post-game grade out of 10 for a single player, single source of truth for
 * the "Note" badge everywhere it's shown. Prefers the backend-computed
 * `stats.rating` (see {@link playerRating}'s doc for the authoritative
 * formula it mirrors), falling back to that client-side calculation when
 * `stats.rating` is exactly 0 — same not-yet-backfilled ambiguity as
 * `damageSplitFor`/`crowdControlSecondsFor` (NOT NULL, defaults to 0 until
 * recomputed).
 */
export function ratingFor(
  player: LoLGameParticipant,
  team: LoLGameParticipant[],
  timeline: LoLGameTimelineFrame[] | undefined,
  durationSeconds: number,
): number {
  const apiRating = player.stats?.rating ?? 0;
  if (apiRating > 0) {
    return apiRating;
  }

  return playerRating(player, team, timeline, durationSeconds);
}

export function ratingToneClass(rating: number): string {
  if (rating >= 9) return 'text-mpYellowInk border-mpYellow/45 bg-mpYellow/15';
  if (rating >= 6.5) return 'text-mpGreenInk border-mpGreen/45 bg-mpGreen/15';
  if (rating >= 5) return 'text-mpBlueInk border-mpBlue/45 bg-mpBlue/15';
  return 'text-mpTextSecondary border-mpBorder bg-white/5';
}

/**
 * Fallback-only MVP/ACE picker, superseded by the backend's `LoLGame.mvpParticipantId`
 * / `aceParticipantId` (computed server-side from `stats.rating`). Only used
 * by `lol-game-details.component.ts` when those are `null` — i.e. remakes, no
 * winning team, or (most commonly today) games not yet resynced with the
 * rating backfill.
 */
export function compositeScore(
  player: LoLGameParticipant,
  timeline: LoLGameTimelineFrame[] | undefined,
): number {
  return (
    player.kills * 3 +
    player.assists * 1.5 -
    player.deaths +
    damageToChampionsFor(player, timeline) / 1000 +
    goldEarnedFor(player, timeline) / 1000
  );
}

export function bestParticipant(
  participants: LoLGameParticipant[],
  valueFn: (p: LoLGameParticipant) => number,
): { player: LoLGameParticipant; value: number } | undefined {
  if (participants.length === 0) {
    return undefined;
  }

  return participants
    .map((player) => ({ player, value: valueFn(player) }))
    .sort((a, b) => b.value - a.value)[0];
}

export function playerDisplayName(player: LoLGameParticipant): string {
  return player.player?.nickname || player.riotIdGameName || 'Joueur inconnu';
}

/**
 * "Maxime (MaxLaMenace)" — the GameOn nickname followed by the Riot name, and
 * the Riot name alone when the participant isn't linked to a GameOn account
 * (or when both are the same string).
 */
export function playerFullName(player: LoLGameParticipant): string {
  const riotName = player.riotIdGameName || 'Joueur inconnu';
  const nickname = player.player?.nickname;

  return nickname && nickname !== riotName
    ? `${nickname} (${riotName})`
    : riotName;
}

export function isLinkedToGameOn(player: LoLGameParticipant): boolean {
  return player.player != null;
}

export function gameDurationSeconds(game: LoLGame): number {
  const start = new Date(game.gameStart).getTime();
  const end = new Date(game.gameEnd).getTime();
  const seconds = (end - start) / 1000;
  return Number.isNaN(seconds) || seconds <= 0 ? 0 : seconds;
}

/**
 * Single source of truth for a game's duration: the backend-computed
 * `stats.gameDurationSeconds` (identical on every backfilled participant)
 * when available, the `gameEnd - gameStart` difference otherwise — so
 * per-minute fallbacks never disagree with the `stats` values shown next to
 * them because of a slightly different duration.
 */
export function durationSecondsFor(game: LoLGame): number {
  const fromStats = game.leagueOfLegendsGameParticipants.find(
    (p) => (p.stats?.gameDurationSeconds ?? 0) > 0,
  )?.stats?.gameDurationSeconds;

  return fromStats ?? gameDurationSeconds(game);
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimestamp(ms: number): string {
  return formatDuration(ms / 1000);
}

/** "28,4k" / "842" — French decimal separator, like every other label here. */
export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1000) {
    return decimalLabel(value / 1000, 1) + 'k';
  }

  return Math.round(value).toString();
}

export function formatFull(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(Math.round(value));
}

/** Wall-clock timezone every LoL date is displayed in, regardless of the viewer's own. */
export const LOL_DISPLAY_TIMEZONE = 'Europe/Paris';

/**
 * API DateTime fields (gameStart, gameEnd, retrievedOn, LoLFunStatDto's
 * gameDate, ...) now carry an explicit 'Z' suffix: the backend forces every
 * date of its model through a UTC round-trip, so `new Date(...)` parses them
 * correctly on its own and they are passed through unchanged.
 *
 * The round-trip applies on read, so rows written before the fix are covered
 * too. The normalization below is kept as a safety net: should an offset-less
 * string ever come back, `new Date(...)` would read it as the *viewer's* local
 * time and silently shift the displayed time by that viewer's UTC offset,
 * whereas these dates are always UTC.
 */
export function parseApiDate(date: Date | string): Date {
  if (date instanceof Date) {
    return date;
  }

  const hasTimezone = /Z$|[+-]\d{2}:\d{2}$/.test(date);
  return new Date(hasTimezone ? date : `${date}Z`);
}

export function formatDateTime(date: Date | string): string {
  const parsedDate = parseApiDate(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date inconnue';
  }

  const datePart = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    timeZone: LOL_DISPLAY_TIMEZONE,
  }).format(parsedDate);

  const timePart = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: LOL_DISPLAY_TIMEZONE,
  }).format(parsedDate);

  return `${datePart} à ${timePart}`;
}

/** Same as {@link formatDateTime} with an abbreviated month ("8 juil. à 21:42"). */
export function formatShortDateTime(date: Date | string): string {
  const parsedDate = parseApiDate(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date inconnue';
  }

  const datePart = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    timeZone: LOL_DISPLAY_TIMEZONE,
  }).format(parsedDate);

  const timePart = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: LOL_DISPLAY_TIMEZONE,
  }).format(parsedDate);

  return `${datePart} à ${timePart}`;
}

export function formatRelativeDate(date: Date | string): string {
  const diffMs = Date.now() - parseApiDate(date).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `il y a ${days} j`;

  const months = Math.floor(days / 30);
  if (months < 12) return `il y a ${months} mois`;

  const years = Math.floor(months / 12);
  return `il y a ${years} an${years > 1 ? 's' : ''}`;
}
