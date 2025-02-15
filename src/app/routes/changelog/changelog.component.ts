import { Component, OnInit } from '@angular/core';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { Changelog } from '../../shared/classes/common/Changelog';
import { GameOnChangelogService } from '../../shared/services/common/gameon-changelog.service';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.css',
  standalone: false,
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
