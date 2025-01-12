import { Component, OnInit } from '@angular/core';
import {
  faFileExcel,
  faHashtag,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';
import { GameOnCommonService } from '../../shared/services/common/gameon-common.service';
import { GlobalStatsDto } from '../../shared/classes/fifa/GlobalStatsDto';

@Component({
  selector: 'app-fifa-global-stats',
  templateUrl: './fifa-global-stats.component.html',
  styleUrl: './fifa-global-stats.component.scss',
  standalone: false,
})
export class FifaGlobalStatsComponent implements OnInit {
  statsIcon = faFileExcel;
  countIcon = faHashtag;
  trophyIcon = faTrophy;

  globalStats?: GlobalStatsDto;

  loading = true;
  errorLoading = false;

  constructor(private commonService: GameOnCommonService) {}

  ngOnInit(): void {
    this.commonService.getGlobalStats().subscribe(
      (data) => {
        this.loading = false;
        this.globalStats = data;
      },
      (err) => {
        this.errorLoading = true;
        console.log(err);
      }
    );
  }
}
