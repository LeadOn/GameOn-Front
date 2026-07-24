import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import {
  KeyMoment,
  KeyMomentTone,
  keyMoments,
} from '../../../../shared/classes/lol/lol-key-moments.util';

const TONE_ICON_CLASSES: Record<KeyMomentTone, string> = {
  red: 'bg-mpRed/15 border-mpRed/30',
  blue: 'bg-mpBlue/15 border-mpBlue/30',
  yellow: 'bg-mpYellow/15 border-mpYellow/30',
  green: 'bg-mpGreen/15 border-mpGreen/30',
};

const TONE_TIME_CLASSES: Record<KeyMomentTone, string> = {
  red: 'text-mpRedInk',
  blue: 'text-mpBlueInk',
  yellow: 'text-mpYellowInk',
  green: 'text-mpGreenInk',
};

@Component({
  selector: 'app-lol-game-key-moments',
  standalone: false,
  templateUrl: './lol-game-key-moments.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGameKeyMomentsComponent implements OnChanges {
  @Input()
  players: LoLGameParticipant[] = [];

  @Input()
  timeline?: LoLGameTimelineFrame[];

  @Input()
  winningTeamId: number | null = null;

  /** Derived from the whole timeline, so computed on input change, not in a getter. */
  moments: KeyMoment[] = [];

  ngOnChanges(): void {
    this.moments = keyMoments(this.timeline, this.players, this.winningTeamId);
  }

  iconClass(tone: KeyMomentTone): string {
    return TONE_ICON_CLASSES[tone];
  }

  timeClass(tone: KeyMomentTone): string {
    return TONE_TIME_CLASSES[tone];
  }
}
