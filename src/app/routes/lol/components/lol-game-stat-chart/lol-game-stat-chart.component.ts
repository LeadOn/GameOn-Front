import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import { LoLGameTimelineFrameParticipant } from '../../../../shared/classes/lol/LoLGameTimelineFrameParticipant';
import {
  formatCompact,
  formatTimestamp,
  frameStatsFor,
} from '../../../../shared/classes/lol/lol-match.util';

type StatKey = keyof Pick<
  LoLGameTimelineFrameParticipant,
  | 'attackDamage'
  | 'abilityPower'
  | 'attackSpeed'
  | 'abilityHaste'
  | 'lifesteal'
  | 'omnivamp'
  | 'physicalVamp'
  | 'spellVamp'
  | 'magicPen'
  | 'magicPenPercent'
  | 'armorPen'
  | 'armorPenPercent'
  | 'bonusArmorPenPercent'
  | 'bonusMagicPenPercent'
  | 'armor'
  | 'magicResist'
  | 'health'
  | 'healthMax'
  | 'healthRegen'
  | 'ccReduction'
  | 'cooldownReduction'
  | 'movementSpeed'
  | 'power'
  | 'powerMax'
  | 'powerRegen'
>;

interface StatOption {
  key: StatKey;
  label: string;
  group: 'Combat' | 'Défense' | 'Autres';
  isPercent?: boolean;
}

const STAT_OPTIONS: StatOption[] = [
  { key: 'attackDamage', label: 'Puissance physique', group: 'Combat' },
  { key: 'abilityPower', label: 'Puissance magique', group: 'Combat' },
  { key: 'attackSpeed', label: 'Vitesse d’attaque', group: 'Combat' },
  { key: 'abilityHaste', label: 'Hâte de compétence', group: 'Combat' },
  { key: 'lifesteal', label: 'Vol de vie', group: 'Combat', isPercent: true },
  { key: 'omnivamp', label: 'Vol de vie omnidirectionnel', group: 'Combat', isPercent: true },
  { key: 'physicalVamp', label: 'Vol de vie physique', group: 'Combat', isPercent: true },
  { key: 'spellVamp', label: 'Vol de vie des sorts', group: 'Combat', isPercent: true },
  { key: 'armorPen', label: 'Pénétration d’armure (brute)', group: 'Combat' },
  { key: 'armorPenPercent', label: 'Pénétration d’armure (%)', group: 'Combat', isPercent: true },
  { key: 'bonusArmorPenPercent', label: 'Pénétration d’armure bonus (%)', group: 'Combat', isPercent: true },
  { key: 'magicPen', label: 'Pénétration magique (brute)', group: 'Combat' },
  { key: 'magicPenPercent', label: 'Pénétration magique (%)', group: 'Combat', isPercent: true },
  { key: 'bonusMagicPenPercent', label: 'Pénétration magique bonus (%)', group: 'Combat', isPercent: true },
  { key: 'armor', label: 'Armure', group: 'Défense' },
  { key: 'magicResist', label: 'Résistance magique', group: 'Défense' },
  { key: 'health', label: 'Points de vie', group: 'Défense' },
  { key: 'healthMax', label: 'Points de vie max', group: 'Défense' },
  { key: 'healthRegen', label: 'Régénération de vie', group: 'Défense' },
  { key: 'ccReduction', label: 'Réduction de CC', group: 'Défense', isPercent: true },
  { key: 'cooldownReduction', label: 'Réduction des délais', group: 'Défense', isPercent: true },
  { key: 'movementSpeed', label: 'Vitesse de déplacement', group: 'Autres' },
  { key: 'power', label: 'Mana / Énergie', group: 'Autres' },
  { key: 'powerMax', label: 'Mana / Énergie max', group: 'Autres' },
  { key: 'powerRegen', label: 'Régénération de mana', group: 'Autres' },
];

const WIDTH = 800;
const HEIGHT = 220;

@Component({
  selector: 'app-lol-game-stat-chart',
  standalone: false,
  templateUrl: './lol-game-stat-chart.component.html',
  styleUrl: './lol-game-stat-chart.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGameStatChartComponent {
  @Input()
  timeline?: LoLGameTimelineFrame[];

  @Input()
  selectedPlayer?: LoLGameParticipant;

  @Input()
  currentFrameIndex = 0;

  readonly width = WIDTH;
  readonly height = HEIGHT;
  readonly options = STAT_OPTIONS;
  readonly groups: StatOption['group'][] = ['Combat', 'Défense', 'Autres'];

  statKey: StatKey = 'attackDamage';

  get selectedOption(): StatOption {
    return (
      this.options.find((o) => o.key === this.statKey) ?? this.options[0]
    );
  }

  optionsFor(group: StatOption['group']): StatOption[] {
    return this.options.filter((o) => o.group === group);
  }

  onStatKeyChange(event: Event): void {
    this.statKey = (event.target as HTMLSelectElement).value as StatKey;
  }

  get frames(): LoLGameTimelineFrame[] {
    return this.timeline ?? [];
  }

  get series(): number[] {
    return this.frames.map(
      (frame) =>
        frameStatsFor(frame, this.selectedPlayer?.puuid)?.[this.statKey] ?? 0,
    );
  }

  private xFor(index: number): number {
    const count = this.frames.length;
    if (count <= 1) {
      return 0;
    }
    return (index / (count - 1)) * this.width;
  }

  private get scale(): number {
    const max = Math.max(1, ...this.series);
    return (this.height - 16) / max;
  }

  private yFor(value: number): number {
    return this.height - 6 - value * this.scale;
  }

  get linePath(): string {
    const values = this.series;
    if (values.length === 0) {
      return '';
    }
    return values
      .map((v, i) => `${i == 0 ? 'M' : 'L'} ${this.xFor(i)},${this.yFor(v)}`)
      .join(' ');
  }

  get areaPath(): string {
    const values = this.series;
    if (values.length === 0) {
      return '';
    }
    const first = `M ${this.xFor(0)},${this.height}`;
    const line = values
      .map((v, i) => `L ${this.xFor(i)},${this.yFor(v)}`)
      .join(' ');
    const last = `L ${this.xFor(values.length - 1)},${this.height}`;
    return `${first} ${line} ${last} Z`;
  }

  get playheadX(): number {
    return this.xFor(this.currentFrameIndex);
  }

  get startLabel(): string {
    return '00:00';
  }

  get endLabel(): string {
    const last = this.frames.at(-1);
    return last ? formatTimestamp(last.timestamp) : '00:00';
  }

  get centerLabel(): string {
    const values = this.series;
    if (values.length === 0 || this.selectedPlayer == null) {
      return '';
    }
    const last = values.at(-1) ?? 0;
    const suffix = this.selectedOption.isPercent ? '%' : '';
    return `${formatCompact(last)}${suffix} en fin de partie`;
  }
}
