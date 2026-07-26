import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import {
  creepScoreFor,
  damageToChampionsFor,
  formatFull,
  goldEarnedFor,
  killParticipationFor,
  latestStatsFor,
  playerDisplayName,
} from '../../../../shared/classes/lol/lol-match.util';

interface RadarAxis {
  label: string;
  valueFn: (player: LoLGameParticipant) => number;
  formatFn?: (value: number) => string;
}

interface RadarVertex {
  x: number;
  y: number;
  label: string;
  valueLabel: string;
  averageLabel: string;
  tooltipWidth: number;
}

interface AxisPoint {
  label: string;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  anchor: 'start' | 'middle' | 'end';
}

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 88;
const RINGS = [0.25, 0.5, 0.75, 1];

@Component({
  selector: 'app-lol-game-player-radar',
  standalone: false,
  templateUrl: './lol-game-player-radar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGamePlayerRadarComponent implements OnChanges {
  @Input()
  player?: LoLGameParticipant;

  @Input()
  players: LoLGameParticipant[] = [];

  @Input()
  timeline?: LoLGameTimelineFrame[];

  size = SIZE;

  /** Outer hexagon, the concentric guides, the spokes and both polygons. */
  gridPolygons: string[] = [];
  spokes: { x: number; y: number }[] = [];
  axisPoints: AxisPoint[] = [];
  playerPolygon = '';
  averagePolygon = '';
  playerVertices: RadarVertex[] = [];
  hoverIndex: number | null = null;

  private axes: RadarAxis[] = [
    {
      label: 'Dégâts',
      valueFn: (p) => damageToChampionsFor(p, this.timeline),
      formatFn: formatFull,
    },
    {
      label: 'Or',
      valueFn: (p) => goldEarnedFor(p, this.timeline),
      formatFn: formatFull,
    },
    { label: 'CS', valueFn: (p) => creepScoreFor(p, this.timeline) },
    { label: 'Vision', valueFn: (p) => p.visionScore },
    {
      label: 'Participation',
      valueFn: (p) =>
        killParticipationFor(
          p,
          this.players.filter((other) => other.teamId === p.teamId),
        ),
      formatFn: (value) => `${Math.round(value)}%`,
    },
    {
      label: 'Encaissé',
      valueFn: (p) =>
        p.stats?.damageTaken ??
        latestStatsFor(this.timeline, p.puuid)?.totalDamageTaken ??
        0,
      formatFn: formatFull,
    },
  ];

  ngOnChanges(): void {
    this.buildGrid();

    if (this.player == null || this.players.length === 0) {
      this.playerPolygon = '';
      this.averagePolygon = '';
      this.playerVertices = [];
      return;
    }

    const player = this.player;
    const averageRatios: number[] = [];
    this.playerVertices = [];
    this.hoverIndex = null;

    this.axes.forEach((axis, index) => {
      const values = this.players.map((p) => axis.valueFn(p));
      const max = Math.max(...values, 0);
      const average = values.reduce((sum, v) => sum + v, 0) / values.length;
      const value = axis.valueFn(player);
      const format = axis.formatFn ?? ((v: number) => Math.round(v).toString());

      averageRatios.push(max > 0 ? average / max : 0);

      const point = this.pointAt(index, max > 0 ? value / max : 0);
      const valueLabel = format(value);
      const averageLabel = `moy. ${format(average)}`;

      this.playerVertices.push({
        ...point,
        label: axis.label,
        valueLabel,
        averageLabel,
        // Rough estimate at the 12px title size; the box is centred on the vertex.
        tooltipWidth:
          Math.max(
            `${axis.label} · ${valueLabel}`.length,
            averageLabel.length,
          ) *
            6.4 +
          18,
      });
    });

    this.playerPolygon = this.toPolygon(this.playerVertices);
    this.averagePolygon = this.toPolygon(
      averageRatios.map((ratio, index) => this.pointAt(index, ratio)),
    );
  }

  onVertexEnter(index: number): void {
    this.hoverIndex = index;
  }

  onVertexLeave(): void {
    this.hoverIndex = null;
  }

  get hoveredVertex(): RadarVertex | null {
    return this.hoverIndex == null
      ? null
      : (this.playerVertices[this.hoverIndex] ?? null);
  }

  private buildGrid(): void {
    this.gridPolygons = RINGS.map((ring) =>
      this.toPolygon(this.axes.map((_, index) => this.pointAt(index, ring))),
    );

    this.spokes = this.axes.map((_, index) => this.pointAt(index, 1));

    this.axisPoints = this.axes.map((axis, index) => {
      const outer = this.pointAt(index, 1);
      const label = this.pointAt(index, 1.28);
      const dx = label.x - CENTER;

      return {
        label: axis.label,
        x: outer.x,
        y: outer.y,
        labelX: label.x,
        labelY: label.y + 3,
        anchor: Math.abs(dx) < 4 ? 'middle' : dx > 0 ? 'start' : 'end',
      };
    });
  }

  /** Axis 0 points straight up, the rest every 60° clockwise. */
  private pointAt(index: number, ratio: number): { x: number; y: number } {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / this.axes.length;
    const r = RADIUS * Math.max(0, Math.min(1.35, ratio));

    return {
      x: CENTER + r * Math.cos(angle),
      y: CENTER + r * Math.sin(angle),
    };
  }

  private toPolygon(points: { x: number; y: number }[]): string {
    return points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  }

  get playerLabel(): string {
    return this.player ? playerDisplayName(this.player) : '';
  }
}
