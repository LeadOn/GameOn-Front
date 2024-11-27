import { Component, OnInit } from '@angular/core';
import { GameOnChangelogService } from '../shared/services/gameon-changelog.service';
import { Changelog } from '../shared/classes/Changelog';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.scss',
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(200, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ChangelogComponent implements OnInit {
  changelogIcon = faClock;
  loading = true;

  changelogs: Changelog[] = [];

  constructor(private changelogService: GameOnChangelogService) {}

  ngOnInit() {
    this.changelogService.getAll().subscribe((changelog) => {
      this.changelogs = changelog;
      this.loading = false;
    });
  }
}
