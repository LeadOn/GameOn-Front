import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { faExternalLink, faList } from '@fortawesome/free-solid-svg-icons';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-lol-game-details-player',
  standalone: false,

  templateUrl: './lol-game-details-player.component.html',
  styleUrl: './lol-game-details-player.component.css',
})
export class LolGameDetailsPlayerComponent implements OnInit, OnChanges {
  @Input()
  player: LoLGameParticipant = new LoLGameParticipant();

  @Input()
  timeline?: LoLGameTimelineFrame[];

  lolVersion$: Observable<string>;

  personalTimeline?: LoLGameTimelineFrame[];

  currentLoLPatch = '';
  externalIcon = faExternalLink;
  detailsIcon = faList;

  showTimeline = false;

  constructor(private lolStore: Store<{ lolVersion: string }>) {
    this.lolVersion$ = this.lolStore.select('lolVersion');
  }

  ngOnInit(): void {
    this.lolVersion$.subscribe((version) => {
      this.currentLoLPatch = version;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.showTimeline = false;
    this.personalTimeline = undefined;
  }

  showPlayerTimeline() {
    this.showTimeline = !this.showTimeline;

    if (this.personalTimeline == null && this.timeline != null) {
      this.personalTimeline = [];

      this.timeline.forEach((frame) => {
        let personalFrame = new LoLGameTimelineFrame();
        personalFrame.timestamp = frame.timestamp;
        personalFrame.matchId = frame.matchId;
        personalFrame.id = frame.id;
        personalFrame.loLGameTimelineFrameParticipants = [];

        frame.loLGameTimelineFrameParticipants.forEach((participant) => {
          if (participant.participantPUUID == this.player.puuid) {
            personalFrame.loLGameTimelineFrameParticipants.push(participant);
          }
        });

        this.personalTimeline?.push(personalFrame);
      });
    }
  }
}
