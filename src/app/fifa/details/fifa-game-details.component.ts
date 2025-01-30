import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faClock,
  faExternalLinkAlt,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GameOnHighlightService } from '../../shared/services/common/gameon-highlight.service';
import { FifaGamePlayed } from '../../shared/classes/fifa/FifaGamePlayed';
import { GameOnGameService } from '../../shared/services/fifa/gameon-game.service';
import { CreateHighlightDto } from '../../shared/classes/common/CreateHighlightDto';
import Keycloak from 'keycloak-js';
import { Player } from '../../shared/classes/common/Player';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-fifa-game-details',
  templateUrl: './fifa-game-details.component.html',
  styleUrls: ['./fifa-game-details.component.scss'],

  standalone: false,
})
export class FifaGameDetailsComponent implements OnInit {
  private readonly keycloak = inject(Keycloak);

  player$: Observable<Player>;

  gameId: any;
  loading = true;
  game: FifaGamePlayed = new FifaGamePlayed();
  externalIcon = faExternalLinkAlt;
  clockIcon = faClock;
  plusIcon = faPlusCircle;
  successMessage = false;
  isLoggedIn = false;
  isAdmin = false;
  team1GoalPercentage = 0;
  showCreateHighlightForm = false;
  showDeclareScore = false;

  createHighlightForm = new FormGroup({
    name: new FormControl('', [Validators.maxLength(50), Validators.required]),
    description: new FormControl('', [Validators.maxLength(500)]),
    externalUrl: new FormControl('', [Validators.maxLength(300)]),
  });

  declareScoreForm = new FormGroup({
    scoreTeam1: new FormControl(0, Validators.required),
    scoreTeam2: new FormControl(0, Validators.required),
  });

  constructor(
    private route: ActivatedRoute,
    private gameService: GameOnGameService,
    private highlightService: GameOnHighlightService,
    private router: Router,
    private playerStore: Store<{ player: Player }>
  ) {
    this.player$ = this.playerStore.select('player');
  }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');

    this.isLoggedIn =
      this.keycloak.authenticated != null && this.keycloak.authenticated
        ? true
        : false;
    this.isAdmin = this.keycloak.hasRealmRole('gameon_admin');

    this.getGame();
  }

  toggleCreateHighlightForm() {
    this.showCreateHighlightForm = !this.showCreateHighlightForm;
  }

  getGame() {
    this.gameService.getById(this.gameId).subscribe(
      (data) => {
        this.game = data;
        this.loading = false;

        let totalGoals = data.team1.score + data.team2.score;
        this.team1GoalPercentage = (data.team1.score / totalGoals) * 100;

        if (this.isLoggedIn) {
          this.player$.subscribe((x) => {
            if (
              this.game.team1.players.find((p) => p.id == x.id) != null ||
              this.game.team2.players.find((p) => p.id == x.id) != null
            ) {
              this.showDeclareScore = true;
            }
          });
        }
      },
      (err) => {
        alert('Une erreur est survenue lors de la récupération du match.');
        console.error(err);
      }
    );
  }

  createHighlight() {
    if (
      this.loading == false &&
      this.createHighlightForm.controls['name'].value != null
    ) {
      this.loading = true;
      this.successMessage = false;

      let createObj = new CreateHighlightDto();
      createObj.name = this.createHighlightForm.controls['name'].value;

      if (this.createHighlightForm.controls['description'].value != null) {
        createObj.description =
          this.createHighlightForm.controls['description'].value;
      }

      if (this.createHighlightForm.controls['externalUrl'].value != null) {
        createObj.externalUrl =
          this.createHighlightForm.controls['externalUrl'].value;
      }

      createObj.fifaGameId = this.gameId;

      this.highlightService.create(createObj).subscribe(
        (data) => {
          this.successMessage = true;
          this.getGame();
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          alert('Une erreur est survenue lors de la création du temps fort !');
        }
      );
    }
  }

  deleteGame() {
    if (
      this.isAdmin == true &&
      confirm('Êtes-vous sûr de vouloir supprimer ce match ?')
    ) {
      this.gameService.deleteGame(this.gameId).subscribe(
        (data) => {
          this.router.navigate(['/fifa']);
        },
        (err) => {
          alert('Une erreur est survenue lors de la suppression du match.');
          console.error(err);
        }
      );
    }
  }

  declareScore() {
    if (
      this.isLoggedIn == true &&
      this.showDeclareScore == true &&
      confirm('Êtes-vous sûr de vouloir déclarer ce score ?')
    ) {
      this.loading = true;
      let score1 = 0;
      let score2 = 0;

      if (this.declareScoreForm.controls['scoreTeam1'].value != null) {
        score1 = this.declareScoreForm.controls['scoreTeam1'].value;
      }

      if (this.declareScoreForm.controls['scoreTeam2'].value != null) {
        score2 = this.declareScoreForm.controls['scoreTeam2'].value;
      }

      this.gameService.declareScore(this.gameId, score1, score2).subscribe(
        (data) => {
          this.getGame();
        },
        (err) => {
          alert('Une erreur est survenue lors de la déclaration du score.');
          console.error(err);
        }
      );
    }
  }
}
