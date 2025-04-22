import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faClock,
  faMinusCircle,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { GameOnAdminService } from '../../shared/services/gameon-admin.service';
import { Changelog } from '../../../shared/classes/common/Changelog';
import { GameOnChangelogService } from '../../../shared/services/common/gameon-changelog.service';

@Component({
  selector: 'app-admin-changelog-edit',
  templateUrl: './admin-changelog-edit.component.html',
  styleUrls: ['./admin-changelog-edit.component.css'],
  standalone: false,
})
export class AdminChangelogEditComponent implements OnInit {
  changelogId: any;
  changelog: Changelog = new Changelog();
  loading = true;
  changelogIcon = faClock;
  plusIcon = faPlusCircle;
  minusIcon = faMinusCircle;

  updateChangelogForm = new FormGroup({
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
    private route: ActivatedRoute,
    private changelogService: GameOnChangelogService,
    private adminService: GameOnAdminService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.changelogId = this.route.snapshot.paramMap.get('id');

    this.changelogService.get(this.changelogId).subscribe(
      (data) => {
        this.loading = false;
        this.changelog = data;

        if (this.changelog.name != null) {
          this.updateChangelogForm.controls['name'].setValue(
            this.changelog.name,
          );
        }

        this.updateChangelogForm.controls['version'].setValue(
          this.changelog.version,
        );

        if (this.changelog.context != null) {
          this.updateChangelogForm.controls['context'].setValue(
            this.changelog.context,
          );
        }

        this.updateChangelogForm.controls['type'].setValue(this.changelog.type);
        this.updateChangelogForm.controls['published'].setValue(
          this.changelog.published,
        );

        this.changelog.newFeatures = this.changelog.newFeatures;
        this.changelog.updatedFeatures = this.changelog.updatedFeatures;
        this.changelog.removedFeatures = this.changelog.removedFeatures;
      },
      (err) => {
        console.error(err);
        alert('Une erreur est survenue lors de la récupération du changelog.');
        this.loading = false;
      },
    );
  }

  updateChangelog() {
    if (
      this.updateChangelogForm.controls['version'].value != null &&
      this.updateChangelogForm.controls['version'].value != '' &&
      this.updateChangelogForm.controls['type'].value != null
    ) {
      if (
        this.updateChangelogForm.controls['name'].value != null &&
        this.updateChangelogForm.controls['name'].value != ''
      ) {
        this.changelog.name = this.updateChangelogForm.controls['name'].value;
      } else {
        this.changelog.name = undefined;
      }

      this.changelog.version =
        this.updateChangelogForm.controls['version'].value;

      if (
        this.updateChangelogForm.controls['context'].value != null &&
        this.updateChangelogForm.controls['context'].value != ''
      ) {
        this.changelog.context =
          this.updateChangelogForm.controls['context'].value;
      } else {
        this.changelog.context = undefined;
      }

      this.changelog.type = this.updateChangelogForm.controls['type'].value;

      if (this.updateChangelogForm.controls['published'].value != null) {
        this.changelog.published =
          this.updateChangelogForm.controls['published'].value;
      }

      console.log(this.changelog);

      this.loading = true;

      this.adminService.updateChangelog(this.changelog).subscribe(
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

  deleteChangelog() {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce changelog ?')) {
      this.loading = true;

      this.adminService.deleteChangelog(this.changelogId).subscribe(
        (data) => {
          this.loading = false;
          this.router.navigate(['/admin/changelog']);
        },
        (err) => {
          console.error(err);
          alert('Erreur lors de la suppression du changelog !');
          this.loading = false;
        },
      );
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
