import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GameOnAdminService } from '../../shared/services/gameon-admin.service';
import { UpdateGame } from '../../shared/classes/UpdateGame';
import { Platform } from '../../../shared/classes/common/Platform';
import { GameOnPlatformService } from '../../../shared/services/common/gameon-platform.service';
import { FifaGamePlayed } from '../../../shared/classes/fifa/FifaGamePlayed';
import { FifaTeam } from '../../../shared/classes/fifa/FifaTeam';
import { GameOnGameService } from '../../../shared/services/fifa/gameon-game.service';
import { GameOnFifaTeamService } from '../../../shared/services/fifa/gameon-fifateam.service';

@Component({
  selector: 'app-admin-fifa-game-edit',
  templateUrl: './admin-fifa-game-edit.component.html',
  styleUrls: ['./admin-fifa-game-edit.component.scss'],
  standalone: false,
})
export class AdminFifaGameEditComponent implements OnInit {
  gameId: any;
  game: FifaGamePlayed = new FifaGamePlayed();
  platforms: Platform[] = [];
  fifaTeams: FifaTeam[] = [];
  loading = true;

  updateGameForm = new FormGroup({
    teamFifa1: new FormControl(0, Validators.required),
    teamFifa2: new FormControl(0, Validators.required),
    platform: new FormControl(0),
    teamScore1: new FormControl(0, [Validators.min(0)]),
    teamScore2: new FormControl(0, [Validators.min(0)]),
    isPlayed: new FormControl(false, [Validators.required]),
    tournamentId: new FormControl(-1),
    phase: new FormControl(-1),
  });

  constructor(
    private route: ActivatedRoute,
    private gameService: GameOnGameService,
    private platformService: GameOnPlatformService,
    private fifaTeamService: GameOnFifaTeamService,
    private adminService: GameOnAdminService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.getPlatforms();
  }

  getGame() {
    this.gameService.getById(this.gameId).subscribe(
      (data) => {
        this.game = data;
        this.updateGameForm.controls['teamFifa1'].setValue(
          this.game.team1.fifaTeamId,
        );
        this.updateGameForm.controls['teamScore1'].setValue(
          this.game.team1.score,
        );
        this.updateGameForm.controls['teamFifa2'].setValue(
          this.game.team2.fifaTeamId,
        );
        this.updateGameForm.controls['teamScore2'].setValue(
          this.game.team2.score,
        );
        this.updateGameForm.controls['isPlayed'].setValue(this.game.isPlayed);
        this.updateGameForm.controls['platform'].setValue(this.game.platformId);

        if (this.game.tournamentId != null) {
          this.updateGameForm.controls['tournamentId'].setValue(
            this.game.tournamentId,
          );
        }

        if (this.game.phase != null) {
          this.updateGameForm.controls['phase'].setValue(this.game.phase);
        }

        this.updateGameForm.controls['platform'].setValue(this.game.platformId);
        this.loading = false;
      },
      (err) => {
        console.error(err);
        alert('Une erreur est survenue lors de la récupération du match.');
        this.loading = false;
      },
    );
  }

  getPlatforms() {
    this.platformService.getAll().subscribe(
      (data) => {
        this.platforms = data;
        this.getFifaTeams();
      },
      (err) => {
        console.error(err);
        alert(
          'Une erreur est survenue lors de la récupération des plateformes.',
        );
      },
    );
  }

  getFifaTeams() {
    this.fifaTeamService.getAll().subscribe(
      (data) => {
        this.fifaTeams = data;
        this.getGame();
      },
      (err) => {
        console.error(err);
        alert(
          'Une erreur est survenue lors de la récupération des plateformes.',
        );
      },
    );
  }

  updateGame() {
    let updateGame = new UpdateGame();
    updateGame.Id = this.gameId;

    if (this.updateGameForm.controls['phase'].value != null) {
      updateGame.phase = this.updateGameForm.controls['phase'].value;
    }
    if (
      this.updateGameForm.controls['tournamentId'].value != null &&
      this.updateGameForm.controls['tournamentId'].value != -1
    ) {
      updateGame.tournamentId =
        this.updateGameForm.controls['tournamentId'].value;
    }

    if (
      this.updateGameForm.controls['platform'].value != null &&
      this.updateGameForm.controls['platform'].value != -1
    ) {
      updateGame.PlatformId = this.updateGameForm.controls['platform'].value;
    }
    if (this.updateGameForm.controls['teamFifa1'].value != null) {
      updateGame.FifaTeam1 = this.updateGameForm.controls['teamFifa1'].value;
    }
    if (this.updateGameForm.controls['teamScore1'].value != null) {
      updateGame.TeamScore1 = this.updateGameForm.controls['teamScore1'].value;
    }
    if (this.updateGameForm.controls['teamFifa2'].value != null) {
      updateGame.FifaTeam2 = this.updateGameForm.controls['teamFifa2'].value;
    }
    if (this.updateGameForm.controls['teamScore2'].value != null) {
      updateGame.TeamScore2 = this.updateGameForm.controls['teamScore2'].value;
    }

    if (this.updateGameForm.controls['isPlayed'].value != null) {
      updateGame.isPlayed = this.updateGameForm.controls['isPlayed'].value;
    }

    if (
      updateGame.Id != 0 &&
      updateGame.FifaTeam1 != 0 &&
      updateGame.FifaTeam2 != 0 &&
      this.loading == false
    ) {
      this.loading = true;
      this.adminService.updateGame(updateGame).subscribe(
        (data) => {
          alert('Match mis à jour !');
          this.loading = false;
          this.router.navigate(['/admin/fifa-games']);
        },
        (err) => {
          alert('Erreur lors de la mise à jour du match ! Erreur : ' + err);
          this.loading = false;
        },
      );
    } else {
      alert('Certaines informations sont manquantes !');
    }
  }
}
