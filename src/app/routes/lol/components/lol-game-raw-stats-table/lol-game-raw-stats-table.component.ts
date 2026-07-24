import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import {
  CHALLENGE_FIELD_KEYS,
  challengeFieldLabel,
} from '../../../../shared/classes/lol/lol-challenge-fields.util';
import { LoLGameParticipantChallenges } from '../../../../shared/classes/lol/LoLGameParticipantChallenges';
import {
  championIconUrl,
  playerDisplayName,
} from '../../../../shared/classes/lol/lol-match.util';
import {
  roleIconUrl,
  roleLabel,
} from '../../../../shared/classes/lol/lol-role.util';

interface ChallengeRow {
  key: keyof LoLGameParticipantChallenges;
  label: string;
}

@Component({
  selector: 'app-lol-game-raw-stats-table',
  standalone: false,
  templateUrl: './lol-game-raw-stats-table.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGameRawStatsTableComponent {
  @Input()
  players: LoLGameParticipant[] = [];

  @Input()
  patch = '';

  expanded = false;

  rows: ChallengeRow[] = CHALLENGE_FIELD_KEYS.map((key) => ({
    key,
    label: challengeFieldLabel(key),
  }));

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  playerDisplayName(player: LoLGameParticipant): string {
    return playerDisplayName(player);
  }

  championIconUrl(player: LoLGameParticipant): string {
    return championIconUrl(player.championName, this.patch);
  }

  roleIconUrl(player: LoLGameParticipant): string | undefined {
    return roleIconUrl(player.teamPosition);
  }

  roleLabel(player: LoLGameParticipant): string {
    return roleLabel(player.teamPosition);
  }

  nameColorClass(player: LoLGameParticipant): string {
    return player.teamId === 100 ? 'text-mpBlueInk' : 'text-mpRedInk';
  }

  cellValue(
    player: LoLGameParticipant,
    key: keyof LoLGameParticipantChallenges,
  ): string {
    const value = player.challenges?.[key];
    if (value == null) {
      return '—';
    }

    if (Number.isInteger(value)) {
      return new Intl.NumberFormat('fr-FR').format(value);
    }

    return value.toFixed(2).replace('.', ',');
  }
}
