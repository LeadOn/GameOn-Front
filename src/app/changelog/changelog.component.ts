import { Component, OnInit } from '@angular/core';
import { GameOnChangelogService } from '../shared/services/gameon-changelog.service';
import { Changelog } from '../shared/classes/common/Changelog';
import { faClock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.scss',
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
