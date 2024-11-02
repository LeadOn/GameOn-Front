import { Component, OnInit } from '@angular/core';
import { GameOnChangelogService } from '../shared/services/gameon-changelog.service';
import { Changelog } from '../shared/classes/Changelog';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.scss',
})
export class ChangelogComponent implements OnInit {
  changelogs: Changelog[] = [];

  constructor(private changelogService: GameOnChangelogService) {}

  ngOnInit() {
    this.changelogService.getAll().subscribe((changelog) => {
      this.changelogs = changelog;
    });
  }
}
