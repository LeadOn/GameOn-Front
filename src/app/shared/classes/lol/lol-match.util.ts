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
