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

  ngOnInit(): void {}
}
