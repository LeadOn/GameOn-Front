import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faClock,
  faExternalLinkAlt,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { GameOnHighlightService } from '../../shared/services/common/gameon-highlight.service';
import { FifaGamePlayed } from '../../shared/classes/fifa/FifaGamePlayed';
import { GameOnGameService } from '../../shared/services/fifa/gameon-game.service';
import { CreateHighlightDto } from '../../shared/classes/common/CreateHighlightDto';

@Component({
  selector: 'app-fifa-game-details',
  templateUrl: './fifa-game-details.component.html',
  styleUrls: ['./fifa-game-details.component.scss'],
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
  standalone: false,
})
export class FifaGameDetailsComponent implements OnInit {
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

  createHighlightForm = new FormGroup({
    name: new FormControl('', [Validators.maxLength(50), Validators.required]),
    description: new FormControl('', [Validators.maxLength(500)]),
    externalUrl: new FormControl('', [Validators.maxLength(300)]),
  });

  constructor(
    private route: ActivatedRoute,
    private gameService: GameOnGameService,
    private highlightService: GameOnHighlightService,
    private keycloak: KeycloakService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');

    this.isLoggedIn = this.keycloak.isLoggedIn();
    this.isAdmin = this.keycloak.isUserInRole('gameon_admin');

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
}
