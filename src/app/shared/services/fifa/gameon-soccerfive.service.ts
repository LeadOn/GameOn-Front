import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SoccerFiveDto } from '../../classes/fifa/SoccerFiveDto';
import { SoccerFive } from '../../classes/fifa/SoccerFive';
import { VoteSoccerFiveDto } from '../../classes/fifa/VoteSoccerFiveDto';
import { SoccerFiveVoteChoice } from '../../classes/fifa/SoccerFiveVoteChoice';

@Injectable({
  providedIn: 'root',
})
export class GameOnSoccerfiveService {
  baseControllerUrl = environment.gameOnApiUrl + '/fifa/soccerfive';

  constructor(private client: HttpClient) {}

  getAll(): Observable<SoccerFive[]> {
    return this.client.get<SoccerFive[]>(this.baseControllerUrl);
  }

  getById(id: number): Observable<SoccerFiveDto> {
    return this.client.get<SoccerFiveDto>(this.baseControllerUrl + '/' + id);
  }

  create(
    name?: string,
    description?: string,
    plannedOn?: string
  ): Observable<SoccerFive> {
    return this.client.post<SoccerFive>(this.baseControllerUrl, {
      name,
      description,
      plannedOn,
    });
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
      this.baseControllerUrl + '/' + fiveId + '/survey',
      {
        SoccerFiveId: fiveId,
        VoteQuestion: question,
        VotesChoices: choices,
      }
    );
  }

  vote(fiveId: number, voteDto: VoteSoccerFiveDto) {
    return this.client.post<boolean>(
      this.baseControllerUrl + '/' + fiveId + '/survey/vote',
      voteDto
    );
  }

  update(
    fiveId: number,
    name?: string,
    description?: string,
    dateTime?: string,
    state?: number
  ) {
    let body = {
      id: fiveId,
      name,
      description,
      plannedOn: dateTime,
      state,
    };

    return this.client.patch<SoccerFiveDto>(this.baseControllerUrl, body);
  }

  delete(fiveId: number) {
    return this.client.delete(this.baseControllerUrl + '/' + fiveId);
  }
}
