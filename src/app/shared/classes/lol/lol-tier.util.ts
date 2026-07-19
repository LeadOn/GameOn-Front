import { LeagueOfLegendsRankHistory } from './LeagueOfLegendsRankHistory';

export const TIER_ORDER = [
  'CHALLENGER',
  'GRANDMASTER',
  'MASTER',
  'DIAMOND',
  'EMERALD',
  'PLATINUM',
  'GOLD',
  'SILVER',
  'BRONZE',
  'IRON',
];
export const RANK_ORDER = ['I', 'II', 'III', 'IV'];

// Master/Grandmaster/Challenger have no divisions in LoL — they're ranked
// purely by LP. Riot's API still fills `rank` with a legacy placeholder
// ("I") for these tiers, so callers must not display it.
export const APEX_TIERS = new Set(['MASTER', 'GRANDMASTER', 'CHALLENGER']);

export const TIER_GLOW_COLORS: Record<string, string> = {
  IRON: '119, 119, 119',
  BRONZE: '169, 128, 90',
  SILVER: '178, 191, 200',
  GOLD: '212, 172, 12',
  PLATINUM: '55, 187, 178',
  EMERALD: '27, 153, 139',
  DIAMOND: '99, 179, 237',
  MASTER: '168, 85, 247',
  GRANDMASTER: '237, 41, 57',
  CHALLENGER: '132, 231, 240',
};
export const DEFAULT_GLOW_COLOR = '115, 195, 233';

export function tierRankScore(rank?: LeagueOfLegendsRankHistory): number {
  if (!rank) return Number.MAX_SAFE_INTEGER;
  const tierScore = TIER_ORDER.indexOf(rank.tier.toUpperCase());
  const divScore = RANK_ORDER.indexOf(rank.rank.toUpperCase());
  const t = tierScore < 0 ? 99 : tierScore;
  const d = divScore < 0 ? 0 : divScore;
  return t * 10000 + d * 1000 - rank.leaguePoints;
}

export function tierWinRate(rank?: LeagueOfLegendsRankHistory): number {
  if (!rank) return 0;
  const total = rank.wins + rank.losses;
  return total === 0 ? 0 : Math.round((rank.wins / total) * 100);
}

export function tierLabel(rank?: LeagueOfLegendsRankHistory): string {
  if (!rank) return 'Non classé';
  const tierUpper = rank.tier.toUpperCase();
  const tier = rank.tier.charAt(0) + rank.tier.slice(1).toLowerCase();
  return APEX_TIERS.has(tierUpper) ? tier : `${tier} ${rank.rank}`;
}

export function tierGlowRgb(rank?: LeagueOfLegendsRankHistory): string {
  const tier = rank?.tier?.toUpperCase();
  return (tier != null && TIER_GLOW_COLORS[tier]) || DEFAULT_GLOW_COLOR;
}

export function tierGlowShadow(rank?: LeagueOfLegendsRankHistory): string {
  return `drop-shadow(0 0 12px rgba(${tierGlowRgb(rank)}, 0.65))`;
}

export function tierGlowBackground(rank?: LeagueOfLegendsRankHistory): string {
  return `rgba(${tierGlowRgb(rank)}, 0.25)`;
}

export function tierEmblemUrl(rank?: LeagueOfLegendsRankHistory): string {
  if (!rank) return 'assets/img/gameon-logo.webp';
  return `assets/img/lol/rank/${rank.tier.toLowerCase()}.png`;
}
