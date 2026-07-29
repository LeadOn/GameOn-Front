import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { faChevronDown, faList } from '@fortawesome/free-solid-svg-icons';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import {
  championIconUrl,
  creepScoreFor,
  damageToChampionsFor,
  decimalLabel,
  formatCompact,
  formatFull,
  goldEarnedFor,
  itemIconUrl,
  itemSlots,
  kda,
  kdaColorClass,
  kdaLabel,
  killParticipationFor,
  latestStatsFor,
  playerDisplayName,
  playerRating,
  ratingToneClass,
} from '../../../../shared/classes/lol/lol-match.util';
import {
  roleIconUrl,
  roleLabel,
} from '../../../../shared/classes/lol/lol-role.util';

@Component({
  selector: 'app-lol-game-details-player',
  standalone: false,

  templateUrl: './lol-game-details-player.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lol-game-details-player.component.css',
})
export class LolGameDetailsPlayerComponent {
  @Input()
  player: LoLGameParticipant = new LoLGameParticipant();

  @Input()
  team: LoLGameParticipant[] = [];

  @Input()
  timeline?: LoLGameTimelineFrame[];

  @Input()
  isSelected = false;

  @Input()
  isMvp = false;

  @Input()
  isAce = false;

  @Input()
  patch = '';

  @Input()
  durationSeconds = 0;

  @Output()
  playerSelected = new EventEmitter<LoLGameParticipant>();

  detailsIcon = faList;
  expandIcon = faChevronDown;

  showAdvancedStats = false;
  showMoreChallenges = false;

  selectPlayer() {
    this.playerSelected.emit(this.player);
  }

  toggleAdvancedStats(event: Event) {
    event.stopPropagation();
    this.showAdvancedStats = !this.showAdvancedStats;
  }

  toggleMoreChallenges(event: Event) {
    event.stopPropagation();
    this.showMoreChallenges = !this.showMoreChallenges;
  }

  /**
   * The MVP keeps its golden wash even while selected — the two states are
   * mutually exclusive background utilities, so they're resolved here rather
   * than stacked in the template where source order would decide the winner.
   */
  get rowClass(): string {
    if (this.isMvp) {
      return this.isSelected
        ? 'bg-mpYellow/20'
        : 'bg-mpYellow/10 hover:bg-mpYellow/15';
    }

    return this.isSelected
      ? 'light:bg-[rgba(23,30,54,0.06)] bg-white/10'
      : 'light:hover:bg-[rgba(23,30,54,0.04)] hover:bg-white/5';
  }

  get itemSlots(): number[] {
    return itemSlots(this.player);
  }

  get rating(): number {
    return playerRating(
      this.player,
      this.team,
      this.timeline,
      this.durationSeconds || (this.player.stats?.gameDurationSeconds ?? 0),
    );
  }

  get ratingLabel(): string {
    return decimalLabel(this.rating, 1);
  }

  get ratingTone(): string {
    return ratingToneClass(this.rating);
  }

  get damageDealt(): number {
    return damageToChampionsFor(this.player, this.timeline);
  }

  get damageLabel(): string {
    return formatCompact(this.damageDealt);
  }

  /** Bar length, relative to the biggest damage dealer of the same team. */
  get damageBarPercent(): number {
    const max = this.team.reduce(
      (m, p) => Math.max(m, damageToChampionsFor(p, this.timeline)),
      0,
    );
    return max <= 0 ? 0 : Math.max(2, (this.damageDealt / max) * 100);
  }

  /** Physical / magic / true split, as a share of this player's own damage. */
  get damageSplit(): { physical: number; magic: number; trueDamage: number } {
    const stats = latestStatsFor(this.timeline, this.player.puuid);
    const physical = stats?.physicalDamageDoneToChampions ?? 0;
    const magic = stats?.magicDamageDoneToChampions ?? 0;
    const trueDamage = stats?.trueDamageDoneToChampions ?? 0;
    const total = physical + magic + trueDamage;

    if (total <= 0) {
      return { physical: 100, magic: 0, trueDamage: 0 };
    }

    return {
      physical: (physical / total) * 100,
      magic: (magic / total) * 100,
      trueDamage: (trueDamage / total) * 100,
    };
  }

  get goldLabel(): string {
    return formatCompact(this.currentGold);
  }

  /** The bar only shows a total; the split lives in its native tooltip. */
  get damageTitle(): string {
    const stats = latestStatsFor(this.timeline, this.player.puuid);

    return [
      `Physique ${formatFull(stats?.physicalDamageDoneToChampions ?? 0)}`,
      `Magique ${formatFull(stats?.magicDamageDoneToChampions ?? 0)}`,
      `Brut ${formatFull(stats?.trueDamageDoneToChampions ?? 0)}`,
    ].join(' · ');
  }

  get cs(): number {
    return creepScoreFor(this.player, this.timeline);
  }

  get currentGold(): number {
    return goldEarnedFor(this.player, this.timeline);
  }

  get killParticipation(): number {
    return killParticipationFor(this.player, this.team);
  }

  get hasAdvancedStats(): boolean {
    return this.player.stats != null;
  }

  get csPerMinuteLabel(): string {
    return decimalLabel(this.player.stats?.csPerMinute ?? 0);
  }

  get damageDealtToChampionsLabel(): string {
    return formatFull(this.player.stats?.damageDealtToChampions ?? 0);
  }

  get damagePerMinuteLabel(): string {
    return formatFull(this.player.stats?.damagePerMinute ?? 0);
  }

  get goldPerMinuteLabel(): string {
    return formatFull(this.player.stats?.goldPerMinute ?? 0);
  }

  get damageTakenLabel(): string {
    return formatFull(this.player.stats?.damageTaken ?? 0);
  }

  get kdaValue(): number {
    return kda(this.player);
  }

  get kdaLabel(): string {
    return kdaLabel(this.player);
  }

  get kdaColorClass(): string {
    return kdaColorClass(this.kdaValue);
  }

  /** "Jinx · Bot · KP 74%" — the role drops out on modes without lanes. */
  get subtitle(): string {
    return [
      this.player.championName ?? '',
      this.roleLabel,
      `KP ${this.killParticipation}%`,
    ]
      .filter((part) => part !== '')
      .join(' · ');
  }

  get displayName(): string {
    return playerDisplayName(this.player);
  }

  get isLinkedToGameOn(): boolean {
    return this.player.player != null;
  }

  get roleIconUrl(): string | undefined {
    return roleIconUrl(this.player.teamPosition);
  }

  get roleLabel(): string {
    return roleLabel(this.player.teamPosition);
  }

  get hasChallenges(): boolean {
    return this.player.challenges != null;
  }

  get challengeKdaLabel(): string {
    return decimalLabel(this.player.challenges?.kda ?? 0, 2);
  }

  get challengeKillParticipationPercent(): number {
    return Math.round((this.player.challenges?.killParticipation ?? 0) * 100);
  }

  get challengeDamagePerMinuteLabel(): string {
    return formatFull(this.player.challenges?.damagePerMinute ?? 0);
  }

  get challengeGoldPerMinuteLabel(): string {
    return formatFull(this.player.challenges?.goldPerMinute ?? 0);
  }

  get challengeVisionScorePerMinuteLabel(): string {
    return decimalLabel(this.player.challenges?.visionScorePerMinute ?? 0, 2);
  }

  get challengeTeamDamagePercent(): number {
    return Math.round(
      (this.player.challenges?.teamDamagePercentage ?? 0) * 100,
    );
  }

  get challengeSoloKills(): number {
    return this.player.challenges?.soloKills ?? 0;
  }

  get challengeWardTakedowns(): number {
    return this.player.challenges?.wardTakedowns ?? 0;
  }

  get challengeSkillshotsHit(): number {
    return this.player.challenges?.skillshotsHit ?? 0;
  }

  get challengeSkillshotsDodged(): number {
    return this.player.challenges?.skillshotsDodged ?? 0;
  }

  get challengeMultikills(): number {
    return this.player.challenges?.multikills ?? 0;
  }

  get challengeImmobilizeAndKillWithAlly(): number {
    return this.player.challenges?.immobilizeAndKillWithAlly ?? 0;
  }

  get challengeEnemyChampionImmobilizations(): number {
    return this.player.challenges?.enemyChampionImmobilizations ?? 0;
  }

  get challengeDragonTakedowns(): number {
    return this.player.challenges?.dragonTakedowns ?? 0;
  }

  get challengeBaronTakedowns(): number {
    return this.player.challenges?.baronTakedowns ?? 0;
  }

  get challengeTurretTakedowns(): number {
    return this.player.challenges?.turretTakedowns ?? 0;
  }

  get challengeRiftHeraldTakedowns(): number {
    return this.player.challenges?.riftHeraldTakedowns ?? 0;
  }

  get challengeLaneMinionsFirst10MinutesLabel(): string {
    return formatFull(this.player.challenges?.laneMinionsFirst10Minutes ?? 0);
  }

  get challengeMaxCsAdvantageLabel(): string {
    return decimalLabel(
      this.player.challenges?.maxCsAdvantageOnLaneOpponent ?? 0,
      1,
    );
  }

  get challengeJungleCsBefore10MinutesLabel(): string {
    return decimalLabel(
      this.player.challenges?.jungleCsBefore10Minutes ?? 0,
      1,
    );
  }

  get challengeControlWardsPlaced(): number {
    return this.player.challenges?.controlWardsPlaced ?? 0;
  }

  get challengeStealthWardsPlaced(): number {
    return this.player.challenges?.stealthWardsPlaced ?? 0;
  }

  get challengeVisionScoreAdvantageLabel(): string {
    return decimalLabel(
      this.player.challenges?.visionScoreAdvantageLaneOpponent ?? 0,
      2,
    );
  }

  get challengeDamageTakenOnTeamPercent(): number {
    return Math.round(
      (this.player.challenges?.damageTakenOnTeamPercentage ?? 0) * 100,
    );
  }

  get challengeEffectiveHealAndShieldingLabel(): string {
    return formatFull(this.player.challenges?.effectiveHealAndShielding ?? 0);
  }

  get challengeSaveAllyFromDeath(): number {
    return this.player.challenges?.saveAllyFromDeath ?? 0;
  }

  get challengeHighestChampionDamageLabel(): string {
    return this.player.challenges?.highestChampionDamage ? 'Oui' : 'Non';
  }

  get challengeHighestCrowdControlScoreLabel(): string {
    return this.player.challenges?.highestCrowdControlScore ? 'Oui' : 'Non';
  }

  get challengeHighestWardKillsLabel(): string {
    return this.player.challenges?.highestWardKills ? 'Oui' : 'Non';
  }

  get challengePerfectGameLabel(): string {
    return this.player.challenges?.perfectGame ? 'Oui' : 'Non';
  }

  get challengeKillsUnderOwnTurret(): number {
    return this.player.challenges?.killsUnderOwnTurret ?? 0;
  }

  get challengeKillsNearEnemyTurret(): number {
    return this.player.challenges?.killsNearEnemyTurret ?? 0;
  }

  get challengeOutnumberedKills(): number {
    return this.player.challenges?.outnumberedKills ?? 0;
  }

  get challengeSurvivedThreeImmobilizesInFight(): number {
    return this.player.challenges?.survivedThreeImmobilizesInFight ?? 0;
  }

  get challengePickKillWithAlly(): number {
    return this.player.challenges?.pickKillWithAlly ?? 0;
  }

  get challengeTurretPlatesTaken(): number {
    return this.player.challenges?.turretPlatesTaken ?? 0;
  }

  get challengeKTurretsDestroyedBeforePlatesFall(): number {
    return this.player.challenges?.kTurretsDestroyedBeforePlatesFall ?? 0;
  }

  get challengeQuickFirstTurretLabel(): string {
    return this.player.challenges?.quickFirstTurret ? 'Oui' : 'Non';
  }

  get challengeTurretsTakenWithRiftHerald(): number {
    return this.player.challenges?.turretsTakenWithRiftHerald ?? 0;
  }

  get challengeScuttleCrabKills(): number {
    return this.player.challenges?.scuttleCrabKills ?? 0;
  }

  get challengeAlliedJungleMonsterKills(): number {
    return Math.round(this.player.challenges?.alliedJungleMonsterKills ?? 0);
  }

  get challengeEnemyJungleMonsterKills(): number {
    return Math.round(this.player.challenges?.enemyJungleMonsterKills ?? 0);
  }

  get challengeJunglerKillsEarlyJungle(): number {
    return this.player.challenges?.junglerKillsEarlyJungle ?? 0;
  }

  championIconUrl(): string {
    return championIconUrl(this.player.championName, this.patch);
  }

  itemIconUrl(item: number): string {
    return itemIconUrl(item, this.patch);
  }
}
