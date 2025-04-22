import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  faClock,
  faMinusCircle,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { GameOnAdminService } from '../../shared/services/gameon-admin.service';
import { Changelog } from '../../../shared/classes/common/Changelog';
import { GameOnChangelogService } from '../../../shared/services/common/gameon-changelog.service';
import { CreateChangelogDto } from '../../shared/classes/CreateChangelogDto';

@Component({
  selector: 'app-admin-changelog-create',
  templateUrl: './admin-changelog-create.component.html',
  styleUrls: ['./admin-changelog-create.component.css'],
  standalone: false,
})
export class AdminChangelogCreateComponent implements OnInit {
  changelog: Changelog = new Changelog();
  changelogIcon = faClock;
  plusIcon = faPlusCircle;
  minusIcon = faMinusCircle;
  loading = false;

  createChangelogForm = new FormGroup({
    name: new FormControl('', [Validators.maxLength(100)]),
    version: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
    ]),
    context: new FormControl('', [Validators.maxLength(500)]),
    type: new FormControl(0, [Validators.required]),
    published: new FormControl(false, [Validators.required]),
  });

  constructor(
    private changelogService: GameOnChangelogService,
    private adminService: GameOnAdminService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  createChangelog() {
    let newChangelog = new CreateChangelogDto();

    if (
      this.createChangelogForm.controls['version'].value != null &&
      this.createChangelogForm.controls['version'].value != '' &&
      this.createChangelogForm.controls['type'].value != null
    ) {
      if (
        this.createChangelogForm.controls['name'].value != null &&
        this.createChangelogForm.controls['name'].value != ''
      ) {
        newChangelog.name = this.createChangelogForm.controls['name'].value;
      }

      newChangelog.version = this.createChangelogForm.controls['version'].value;

      if (
        this.createChangelogForm.controls['context'].value != null &&
        this.createChangelogForm.controls['context'].value != ''
      ) {
        newChangelog.context =
          this.createChangelogForm.controls['context'].value;
      }

      newChangelog.type = this.createChangelogForm.controls['type'].value;

      if (this.createChangelogForm.controls['published'].value != null) {
        newChangelog.published =
          this.createChangelogForm.controls['published'].value;
      }

      newChangelog.newFeatures = this.changelog.newFeatures;
      newChangelog.updatedFeatures = this.changelog.updatedFeatures;
      newChangelog.removedFeatures = this.changelog.removedFeatures;

      this.loading = true;

      this.adminService.createChangelog(newChangelog).subscribe(
        (data) => {
          this.loading = false;
          this.router.navigate(['/admin/changelog']);
        },
        (err) => {
          alert('Erreur lors de la création du changelog !');
          console.error(err);
          this.loading = false;
        },
      );
    } else {
      alert('Certaines informations sont manquantes !');
    }
  }

  add(type: string) {
    switch (type) {
      case 'new':
        if (this.changelog.newFeatures == null) {
          this.changelog.newFeatures = [];
        }
        this.changelog.newFeatures.push('Nouvelle fonctionnalité');
        break;

      case 'updated':
        if (this.changelog.updatedFeatures == null) {
          this.changelog.updatedFeatures = [];
        }
        this.changelog.updatedFeatures.push('Fonctionnalité mise à jour');
        break;

      case 'removed':
        if (this.changelog.removedFeatures == null) {
          this.changelog.removedFeatures = [];
        }
        this.changelog.removedFeatures.push('Retrait de fonctionnalité');
        break;

      default:
        break;
    }
  }

  remove(type: string, index: number) {
    switch (type) {
      case 'new':
        if (this.changelog.newFeatures != null) {
          this.changelog.newFeatures.splice(index, 1);
        }
        break;

      case 'updated':
        if (this.changelog.updatedFeatures != null) {
          this.changelog.updatedFeatures.splice(index, 1);
        }
        break;

      case 'removed':
        if (this.changelog.removedFeatures != null) {
          this.changelog.removedFeatures.splice(index, 1);
        }
        break;

      default:
        break;
    }
  }

  trackByIdxNew(index: number, obj: any): any {
    return index;
  }

  trackByIdxRemoved(index: number, obj: any): any {
    return index;
  }

  trackByIdxUpdated(index: number, obj: any): any {
    return index;
  }
}
