import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SoccerFive } from '../classes/SoccerFive';
import { SoccerFiveDto } from '../classes/SoccerFiveDto';
import { SoccerFiveVoteChoice } from '../classes/SoccerFiveVoteChoice';
import { VoteSoccerFiveDto } from '../classes/VoteSoccerFiveDto';

@Injectable({
  providedIn: 'root',
})
export class GameOnSoccerfiveService {
  constructor(private client: HttpClient) {}

  getAll(): Observable<SoccerFive[]> {
    return this.client.get<SoccerFive[]>(
      environment.gameOnApiUrl + '/soccerfive'
    );
  }

  getById(id: number): Observable<SoccerFiveDto> {
    return this.client.get<SoccerFiveDto>(
      environment.gameOnApiUrl + '/soccerfive/' + id
    );
  }

  create(
    name?: string,
    description?: string,
    plannedOn?: string
  ): Observable<SoccerFive> {
    return this.client.post<SoccerFive>(
      environment.gameOnApiUrl + '/soccerfive',
      {
        name,
        description,
        plannedOn,
      }
    );
  }

  getStates(): any[] {
    return [
      {
        value: 0,
        label: 'Brouillon',
      },
      {
        value: 1,
        label: 'Planifié',
      },
      {
        value: 2,
        label: 'Terminé',
      },
    ];
  }

  UpdateSurvey(
    fiveId: number,
    question: string,
    choices: SoccerFiveVoteChoice[]
  ): Observable<SoccerFiveDto> {
    return this.client.patch<SoccerFiveDto>(
      environment.gameOnApiUrl + '/soccerfive/' + fiveId + '/survey',
      {
        SoccerFiveId: fiveId,
        VoteQuestion: question,
        VotesChoices: choices,
      }
    );
  }

  vote(fiveId: number, voteDto: VoteSoccerFiveDto) {
    return this.client.post<boolean>(
      environment.gameOnApiUrl + '/soccerfive/' + fiveId + '/survey/vote',
      voteDto
    );
  }
}
