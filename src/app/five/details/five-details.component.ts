import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { SoccerFiveDto } from '../../shared/classes/SoccerFiveDto';
import { GameOnSoccerfiveService } from '../../shared/services/gameon-soccerfive.service';
import { Player } from '../../shared/classes/Player';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  faCheckCircle,
  faCircle,
  faPencil,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SoccerFiveVoteChoice } from '../../shared/classes/SoccerFiveVoteChoice';
import { VoteSoccerFiveDto } from '../../shared/classes/VoteSoccerFiveDto';
@Component({
  selector: 'app-five-details',
  templateUrl: './five-details.component.html',
  styleUrls: ['./five-details.component.scss'],
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
export class FiveDetailsComponent implements OnInit {
  loading = true;
  isLoggedIn = false;
  five?: SoccerFiveDto;
  fiveId: any;
  playersShown = true;
  plannedMatchsShown = false;
  matchsPlayedShown = false;
  player$: Observable<Player>;
  currentUserId = 0;
  surveyIcon = faQuestionCircle;
  soccerFiveVoteChoices: SoccerFiveVoteChoice[] = [];
  circleIcon = faCircle;
  checkIcon = faCheckCircle;
  pencilIcon = faPencil;

  triggerSurveyForm = new FormGroup({
    questionLabel: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
  });

  editFiveForm = new FormGroup({
    name: new FormControl('', [Validators.maxLength(100)]),
    description: new FormControl('', [Validators.maxLength(400)]),
    date: new FormControl(''),
    time: new FormControl(''),
    state: new FormControl(0, [Validators.required]),
  });

  constructor(
    private fiveService: GameOnSoccerfiveService,
    private route: ActivatedRoute,
    private keycloak: KeycloakService,
    private store: Store<{ player: Player }>
  ) {
    this.fiveId = this.route.snapshot.paramMap.get('id');
    this.player$ = store.select('player');
  }

  ngOnInit(): void {
    this.isLoggedIn = this.keycloak.isLoggedIn();
    this.player$.subscribe((data) => {
      this.currentUserId = data.id;

      this.getFive();
    });
  }

  getFive() {
    this.fiveService.getById(this.fiveId).subscribe(
      (data) => {
        this.five = data;

        if (this.five.name != null) {
          this.editFiveForm.controls['name'].setValue(this.five.name);
        }

        if (this.five.description != null) {
          this.editFiveForm.controls['description'].setValue(
            this.five.description
          );
        }

        if (this.five?.voteQuestion) {
          this.triggerSurveyForm.controls['questionLabel'].setValue(
            this.five.voteQuestion
          );
        }

        if (this.five?.votesChoices) {
          this.soccerFiveVoteChoices = this.five.votesChoices;

          if (this.five != null && this.five.votesChoices != null) {
            let numberOfVotes = 0;

            this.five.votesChoices.forEach((x) => {
              numberOfVotes += x.answers?.length || 0;
            });

            this.five.votesChoices.forEach((x) => {
              if (x.answers && numberOfVotes > 0) {
                x.percentage = (x.answers.length / numberOfVotes) * 100;
              } else {
                x.percentage = 0;
              }
            });

            this.five.votesChoices.forEach((x) => {
              if (x.answers) {
                x.answers.forEach((y) => {
                  if (y.playerId == this.currentUserId) {
                    x.voteStatus = true;
                  } else {
                    x.voteStatus = false;
                  }
                });
              } else [(x.voteStatus = false)];
            });
          }
        }

        this.loading = false;
      },
      (err) => {
        alert('Erreur lors de la récupération du five.');
        console.error(err);
      }
    );
  }

  showPlayers() {
    this.playersShown = !this.playersShown;
  }

  showMatchsPlanned() {
    this.plannedMatchsShown = !this.plannedMatchsShown;
  }

  showMatchsPlayed() {
    this.matchsPlayedShown = !this.matchsPlayedShown;
  }

  getState(stateId: number): string {
    let label = 'Inconnu';
    this.fiveService.getStates().forEach((x) => {
      if (x.value == stateId) {
        label = x.label;
      }
    });

    return label;
  }

  addChoice() {
    this.soccerFiveVoteChoices.push(new SoccerFiveVoteChoice());
  }

  removeChoice(choice: any) {
    this.soccerFiveVoteChoices = this.soccerFiveVoteChoices.filter(
      (x) => x !== choice
    );
  }

  updateSurvey() {
    if (
      this.triggerSurveyForm.controls['questionLabel'].value != null &&
      this.triggerSurveyForm.controls['questionLabel'].value != '' &&
      this.soccerFiveVoteChoices.length > 0 &&
      this.five != null
    ) {
      if (
        confirm(
          'Êtes-vous sûr(e) de vouloir modifier le sondage ? Les questions / réponses existantes seront supprimées.'
        )
      ) {
        this.loading = true;

        this.fiveService
          .UpdateSurvey(
            this.five?.id,
            this.triggerSurveyForm.controls['questionLabel'].value,
            this.soccerFiveVoteChoices
          )
          .subscribe(
            (data) => {
              this.five = data;

              this.loading = false;
            },
            (err) => {
              alert('Erreur lors de la mise à jour du sondage.');
              console.error(err);
              this.loading = false;
            }
          );
      }
    } else {
      alert('Certaines informations sont manquantes !');
    }
  }

  updateVote(choice: SoccerFiveVoteChoice) {
    if (this.isLoggedIn == true) {
      this.soccerFiveVoteChoices[
        this.soccerFiveVoteChoices.indexOf(choice)
      ].voteStatus =
        !this.soccerFiveVoteChoices[this.soccerFiveVoteChoices.indexOf(choice)]
          .voteStatus;
    }
  }

  vote() {
    let body = new VoteSoccerFiveDto();

    body.soccerFiveId = this.five?.id || 0;

    this.soccerFiveVoteChoices
      .filter((x) => x.voteStatus == true)
      .forEach((x) => body.choiceIds.push(x.id));

    this.loading = true;
    this.fiveService.vote(this.five?.id || 0, body).subscribe(
      (data) => {
        this.getFive();
      },
      (err) => {
        alert('Erreur lors du vote.');
        console.error(err);
      }
    );
  }

  updateFive() {
    this.loading = true;

    let name = undefined;
    let description = undefined;
    let state = undefined;
    let dateTime = undefined;

    if (
      this.editFiveForm.controls['name'].value != null &&
      this.editFiveForm.controls['name'].value != ''
    ) {
      name = this.editFiveForm.controls['name'].value;
    }

    if (
      this.editFiveForm.controls['description'].value != null &&
      this.editFiveForm.controls['description'].value != ''
    ) {
      description = this.editFiveForm.controls['description'].value;
    }

    if (this.editFiveForm.controls['state'].value != null) {
      state = this.editFiveForm.controls['state'].value;
    }

    if (
      this.editFiveForm.controls['date'].value != null &&
      this.editFiveForm.controls['date'].value != '' &&
      this.editFiveForm.controls['time'].value != null &&
      this.editFiveForm.controls['time'].value != ''
    ) {
      dateTime =
        this.editFiveForm.controls['date'].value.toString().split('T')[0] +
        'T' +
        this.editFiveForm.controls['time'].value.toString();
    }

    this.fiveService
      .update(this.fiveId, name, description, dateTime, state)
      .subscribe(
        (data) => {
          this.getFive();
        },
        (err) => {
          alert('Erreur lors de la mise à jour du five.');
          console.error(err);
        }
      );
  }
}
