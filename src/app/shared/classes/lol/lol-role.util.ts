const ROLE_ICON_NAMES: Record<string, string> = {
  TOP: 'top',
  JUNGLE: 'jungle',
  MIDDLE: 'middle',
  BOTTOM: 'bottom',
  UTILITY: 'utility',
};

const ROLE_LABELS: Record<string, string> = {
  TOP: 'Top',
  JUNGLE: 'Jungle',
  MIDDLE: 'Milieu',
  BOTTOM: 'Bot',
  UTILITY: 'Support',
};

/**
 * `LoLGameParticipant.teamPosition` is Riot's own inferred role
 * (TOP/JUNGLE/MIDDLE/BOTTOM/UTILITY) — empty on modes without lanes (ARAM,
 * URF, ...) or on participants not yet re-synced with the backfill that
 * populates it.
 */
export function roleLabel(teamPosition: string | undefined): string {
  if (teamPosition == null) return '';
  return ROLE_LABELS[teamPosition.toUpperCase()] ?? '';
}

export function roleIconUrl(
  teamPosition: string | undefined,
): string | undefined {
  if (teamPosition == null) return undefined;
  const icon = ROLE_ICON_NAMES[teamPosition.toUpperCase()];
  if (icon == null) return undefined;

  return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/svg/position-${icon}.svg`;
}
