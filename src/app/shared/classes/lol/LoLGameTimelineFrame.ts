import { LoLGameTimelineFrameParticipant } from './LoLGameTimelineFrameParticipant';

export class LoLGameTimelineFrame {
  id: number = 0;
  matchId: string = '';
  timestamp: number = 0;
  loLGameTimelineFrameParticipants: LoLGameTimelineFrameParticipant[] = [];
}
