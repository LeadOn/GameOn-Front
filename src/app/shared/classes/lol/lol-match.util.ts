import { LoLGame } from './LoLGame';
import { LoLGameParticipant } from './LoLGameParticipant';
import { LoLGameTimelineFrame } from './LoLGameTimelineFrame';
import { LoLGameTimelineFrameParticipant } from './LoLGameTimelineFrameParticipant';

export function kda(player: LoLGameParticipant): number {
  const denominator = player.deaths === 0 ? 1 : player.deaths;
  return (player.kills + player.assists) / denominator;
}

export function kdaLabel(player: LoLGameParticipant): string {
  return kda(player).toFixed(2).replace('.', ',');
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

export function compositeScore(
  player: LoLGameParticipant,
  timeline: LoLGameTimelineFrame[] | undefined,
): number {
  const stats = latestStatsFor(timeline, player.puuid);
  const damageToChampions = stats?.totalDamageDoneToChampions ?? 0;
  const goldEarned = stats?.totalGold ?? 0;

  return (
    player.kills * 3 +
    player.assists * 1.5 -
    player.deaths +
    damageToChampions / 1000 +
    goldEarned / 1000
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

export function isLinkedToGameOn(player: LoLGameParticipant): boolean {
  return player.player != null;
}

export function gameDurationSeconds(game: LoLGame): number {
  const start = new Date(game.gameStart).getTime();
  const end = new Date(game.gameEnd).getTime();
  const seconds = (end - start) / 1000;
  return Number.isNaN(seconds) || seconds <= 0 ? 0 : seconds;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimestamp(ms: number): string {
  return formatDuration(ms / 1000);
}

export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1000) {
    return (value / 1000).toFixed(1) + 'k';
  }

  return Math.round(value).toString();
}

export function formatRelativeDate(date: Date | string): string {
  const diffMs = Date.now() - new Date(date).getTime();
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
