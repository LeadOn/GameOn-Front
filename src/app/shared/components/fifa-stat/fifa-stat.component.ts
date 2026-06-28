import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { PlatformStatsDto } from '../../classes/common/PlatformStatsDto';

@Component({
  selector: 'app-fifa-stat',
  templateUrl: './fifa-stat.component.html',
  styleUrls: ['./fifa-stat.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FifaStatComponent implements OnInit {
  @Input()
  stat: PlatformStatsDto = new PlatformStatsDto();

  ngOnInit(): void {}
}
