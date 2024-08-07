import { Component, OnInit } from '@angular/core';
import { Highlight } from '../../shared/classes/Highlight';
import { GameOnHighlightService } from '../../shared/services/gameon-highlight.service';

@Component({
  selector: 'app-admin-highlights',
  templateUrl: './admin-highlights.component.html',
  styleUrls: ['./admin-highlights.component.scss'],
})
export class AdminHighlightsComponent implements OnInit {
  highlights: Highlight[] = [];
  loading = true;

  constructor(private highlightService: GameOnHighlightService) {}

  ngOnInit(): void {
    this.highlightService.getAll().subscribe(
      (data) => {
        this.highlights = data;
        this.loading = false;
      },
      (err) => {
        alert(
          'Une erreur est survenue lors de la récupération des temps forts.'
        );
        console.error(err);
        this.loading = false;
      }
    );
  }
}
