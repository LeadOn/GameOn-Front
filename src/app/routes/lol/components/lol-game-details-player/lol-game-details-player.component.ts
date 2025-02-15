import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { faExternalLink, faList } from '@fortawesome/free-solid-svg-icons';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-lol-game-details-player',
  standalone: false,

  templateUrl: './lol-game-details-player.component.html',
  styleUrl: './lol-game-details-player.component.css',
})
export class LolGameDetailsPlayerComponent implements OnChanges {
  @Input()
  player: LoLGameParticipant = new LoLGameParticipant();

  @Input()
  timeline?: LoLGameTimelineFrame[];

  personalTimeline?: LoLGameTimelineFrame[];

  currentLoLPatch = environment.currentLoLPatch;
  externalIcon = faExternalLink;
  detailsIcon = faList;

  showTimeline = false;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.showPlayerTimeline();
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
