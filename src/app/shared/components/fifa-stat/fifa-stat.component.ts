import { Component, Input, OnInit } from '@angular/core';
import { PlatformStatsDto } from '../../classes/common/PlatformStatsDto';

@Component({
  selector: 'app-fifa-stat',
  templateUrl: './fifa-stat.component.html',
  styleUrls: ['./fifa-stat.component.css'],
  standalone: false,
})
export class FifaStatComponent implements OnInit {
  @Input()
  stat: PlatformStatsDto = new PlatformStatsDto();

  ngOnInit(): void {}
}
