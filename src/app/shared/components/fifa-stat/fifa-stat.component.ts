import { Component, Input, OnInit } from '@angular/core';
import { PlatformStatsDto } from '../../classes/PlatformStatsDto';

@Component({
  selector: 'app-fifa-stat',
  templateUrl: './fifa-stat.component.html',
  styleUrls: ['./fifa-stat.component.scss'],
})
export class FifaStatComponent implements OnInit {
  @Input()
  stat: PlatformStatsDto = new PlatformStatsDto();

  ngOnInit(): void {
    // let gamesPlayed = this.stat.wins + this.stat.losses + this.stat.draws;
    // this.stat.winRate = parseFloat(
    //   ((this.stat.wins * 100) / gamesPlayed).toFixed(2)
    // );
    // this.stat.looseRate = parseFloat(
    //   ((this.stat.losses * 100) / gamesPlayed).toFixed(2)
    // );
    // this.stat.drawRate = parseFloat(
    //   ((this.stat.draws * 100) / gamesPlayed).toFixed(2)
    // );
  }
}
