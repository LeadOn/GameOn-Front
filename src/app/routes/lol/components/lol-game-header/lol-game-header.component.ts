import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { LoLGame } from '../../../../shared/classes/lol/LoLGame';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import {
  championIconUrl,
  decimalLabel,
  durationSecondsFor,
  formatDuration,
  formatShortDateTime,
  kdaLabel,
  ratingFor,
  ratingToneClass,
} from '../../../../shared/classes/lol/lol-match.util';
import {
  ATAKHAN_ICON_URL,
  BARON_ICON_URL,
  DRAGON_ICON_URL,
  GRUB_ICON_URL,
  HERALD_ICON_URL,
  INHIBITOR_ICON_URL,
  TeamObjectives,
  teamObjectivesFor,
  TOWER_ICON_URL,
} from '../../../../shared/classes/lol/lol-timeline-event.util';

interface ObjectiveBadge {
  iconUrl: string;
  label: string;
  value: number;
}

interface ObjectiveRow {
  teamId: number;
  dotClass: string;
  objectives: TeamObjectives;
  badges: ObjectiveBadge[];
}

@Component({
  selector: 'app-lol-game-header',
  standalone: false,
  templateUrl: './lol-game-header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGameHeaderComponent implements OnChanges {
  @Input()
  game: LoLGame = new LoLGame();

  @Input()
  heroPlayer?: LoLGameParticipant;

  @Input()
  team1: LoLGameParticipant[] = [];

  @Input()
  team2: LoLGameParticipant[] = [];

  @Input()
  timeline?: LoLGameTimelineFrame[];

  @Input()
  patch = '';

  @Input()
  queueLabel = '';

  @Input()
  isMvp = false;

  @Input()
  isAce = false;

  @Input()
  isSyncing = false;

  @Output()
  syncRequested = new EventEmitter<void>();

  refreshIcon = faSync;

  /**
   * Both are derived from the whole timeline (~1500 events), so they're
   * computed once per input change rather than from template getters.
   */
  objectiveRows: ObjectiveRow[] = [];
  rating = 0;

  ngOnChanges(): void {
    const players = [...this.team1, ...this.team2];

    this.objectiveRows = [
      { teamId: 100, dotClass: 'bg-mpGreen' },
      { teamId: 200, dotClass: 'bg-mpRed' },
    ].map(({ teamId, dotClass }) => {
      const objectives = teamObjectivesFor(
        this.game.leagueOfLegendsGameTeams,
        this.timeline,
        players,
        teamId,
      );

      return {
        teamId,
        dotClass,
        objectives,
        badges: this.badgesFor(objectives),
      };
    });

    this.rating = this.heroPlayer
      ? ratingFor(
          this.heroPlayer,
          this.heroPlayer.teamId === 100 ? this.team1 : this.team2,
          this.timeline,
          this.durationSeconds,
        )
      : 0;
  }

  private badgesFor(objectives: TeamObjectives): ObjectiveBadge[] {
    return [
      { iconUrl: TOWER_ICON_URL, label: 'Tourelles', value: objectives.towers },
      {
        iconUrl: INHIBITOR_ICON_URL,
        label: 'Inhibiteurs',
        value: objectives.inhibitors,
      },
      { iconUrl: DRAGON_ICON_URL, label: 'Dragons', value: objectives.dragons },
      {
        iconUrl: HERALD_ICON_URL,
        label: 'Hérauts de la Faille',
        value: objectives.heralds,
      },
      { iconUrl: GRUB_ICON_URL, label: 'Voracraves', value: objectives.grubs },
      {
        iconUrl: BARON_ICON_URL,
        label: 'Barons Nashor',
        value: objectives.barons,
      },
      {
        iconUrl: ATAKHAN_ICON_URL,
        label: 'Atakhan',
        value: objectives.atakhans,
      },
    ].filter((badge) => badge.value > 0);
  }

  /** Nothing worth showing on remakes and never-synced games (0 kills, no objective). */
  get hasObjectives(): boolean {
    return this.objectiveRows.some(
      (row) => row.objectives.kills > 0 || row.badges.length > 0,
    );
  }

  onSync(): void {
    this.syncRequested.emit();
  }

  get isSynced(): boolean {
    return (
      this.game.endOfGameResult != null && this.game.endOfGameResult !== ''
    );
  }

  get heroWon(): boolean | undefined {
    return this.game.isRemake ? undefined : this.heroPlayer?.win;
  }

  get statusLabel(): string {
    if (this.game.isRemake) {
      return 'Remake';
    }

    if (!this.isSynced) {
      return 'Partie non synchronisée';
    }

    return this.heroWon ? 'Victoire' : 'Défaite';
  }

  get statusToneClass(): string {
    if (this.game.isRemake || !this.isSynced) {
      return 'text-mpTextSecondary';
    }

    return this.heroWon ? 'text-mpGreenInk' : 'text-mpRedInk';
  }

  /** Border + colour wash applied to the card itself, keyed on the outcome. */
  get frameClass(): string {
    if (this.game.isRemake || !this.isSynced) {
      return '';
    }

    return this.heroWon ? 'border-mpGreen/35' : 'border-mpRed/35';
  }

  get tintClass(): string {
    if (this.game.isRemake || !this.isSynced) {
      return 'bg-[linear-gradient(180deg,rgba(107,138,251,0.10),transparent)]';
    }

    return this.heroWon
      ? 'bg-[linear-gradient(180deg,rgba(45,224,165,0.16),transparent)]'
      : 'bg-[linear-gradient(180deg,rgba(255,92,116,0.16),transparent)]';
  }

  get glowClass(): string {
    if (this.game.isRemake || !this.isSynced) {
      return 'bg-mpBlue/10';
    }

    return this.heroWon ? 'bg-mpGreen/20' : 'bg-mpRed/20';
  }

  get showRating(): boolean {
    return this.heroPlayer != null && this.isSynced && !this.game.isRemake;
  }

  get ratingLabel(): string {
    return decimalLabel(this.rating, 1);
  }

  get ratingTone(): string {
    return ratingToneClass(this.rating);
  }

  get accoladeLabel(): string {
    if (!this.showRating) {
      return '';
    }

    if (this.isMvp) return 'MVP de la partie';
    if (this.isAce) return 'ACE de la partie';

    return '';
  }

  /**
   * Games that were never synced carry participants with empty names and
   * zeroed scores, so anything that would render as a blank or all-zero
   * fragment is dropped rather than shown as "sur · 0 / 0 / 0".
   */
  get heroLine(): string {
    if (this.heroPlayer == null) {
      return '';
    }

    const { riotIdGameName, championName, kills, deaths, assists } =
      this.heroPlayer;
    const name = riotIdGameName || '';
    const identity = championName ? `${name} sur ${championName}`.trim() : name;

    if (!this.isSynced) {
      return identity;
    }

    return [
      identity,
      `${kills} / ${deaths} / ${assists}`,
      `${kdaLabel(this.heroPlayer)} KDA`,
    ]
      .filter((part) => part !== '')
      .join(' · ');
  }

  get metaLine(): string {
    return [
      this.queueLabel,
      this.durationSeconds > 0 ? formatDuration(this.durationSeconds) : '',
      formatShortDateTime(this.game.gameStart),
      this.patchTitle,
    ]
      .filter((part) => part !== '')
      .join(' · ');
  }

  get durationSeconds(): number {
    return durationSecondsFor(this.game);
  }

  get patchTitle(): string {
    if (!this.game.gameVersion) {
      return '';
    }

    const [major, minor] = this.game.gameVersion.split('.');
    return `Patch ${major}.${minor}`;
  }

  get championIconUrl(): string {
    return championIconUrl(this.heroPlayer?.championName, this.patch);
  }

  /**
   * Splash arts are versionless on data dragon (no patch segment), unlike
   * every other asset this app pulls from it.
   */
  get splashUrl(): string {
    if (!this.heroPlayer?.championName) {
      return '';
    }

    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${this.heroPlayer.championName}_0.jpg`;
  }
}
