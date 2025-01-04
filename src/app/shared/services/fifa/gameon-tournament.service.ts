import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Tournament } from '../../classes/fifa/Tournament';
import { TournamentPlayerDto } from '../../classes/fifa/TournamentPlayerDto';

@Injectable({
  providedIn: 'root',
})
export class GameOnTournamentService {
  baseControllerUrl = environment.gameOnApiUrl + '/fifa/tournament';

  constructor(private client: HttpClient) {}

  getAll(): Observable<Tournament[]> {
    return this.client.get<Tournament[]>(this.baseControllerUrl);
  }

  getFeatured(): Observable<Tournament[]> {
    return this.client.get<Tournament[]>(this.baseControllerUrl + '/featured');
  }

  getById(id: number): Observable<Tournament> {
    return this.client.get<Tournament>(this.baseControllerUrl + '/' + id);
  }

  checkPlayerSubscription(id: number): Observable<TournamentPlayerDto> {
    return this.client.get<TournamentPlayerDto>(
      this.baseControllerUrl + '/' + id + '/subscription'
    );
  }

  subscribe(id: number, fifaTeamId: number): Observable<any> {
    return this.client.post<any>(
      this.baseControllerUrl +
        '/' +
        id +
        '/subscription?fifaTeamId=' +
        fifaTeamId,
      null
    );
  }

  updateSubscription(
    id: number,
    fifaTeamId: number
  ): Observable<TournamentPlayerDto> {
    return this.client.patch<TournamentPlayerDto>(
      this.baseControllerUrl +
        '/' +
        id +
        '/subscription?fifaTeamId=' +
        fifaTeamId,
      null
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
        label: 'Qualifications',
      },
      {
        value: 3,
        label: 'Tournoi en cours',
      },
      {
        value: 4,
        label: 'Clôturé',
      },
    ];
  }
}
