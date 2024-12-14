import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tournament } from '../classes/Tournament';
import { TournamentPlayerDto } from '../classes/TournamentPlayerDto';

@Injectable({
  providedIn: 'root',
})
export class GameOnTournamentService {
  constructor(private client: HttpClient) {}

  getAll(): Observable<Tournament[]> {
    return this.client.get<Tournament[]>(
      environment.gameOnApiUrl + '/tournament'
    );
  }

  getFeatured(): Observable<Tournament[]> {
    return this.client.get<Tournament[]>(
      environment.gameOnApiUrl + '/tournament/featured'
    );
  }

  getById(id: number): Observable<Tournament> {
    return this.client.get<Tournament>(
      environment.gameOnApiUrl + '/tournament/' + id
    );
  }

  checkPlayerSubscription(id: number): Observable<TournamentPlayerDto> {
    return this.client.get<TournamentPlayerDto>(
      environment.gameOnApiUrl + '/tournament/' + id + '/subscription'
    );
  }

  subscribe(id: number, fifaTeamId: number): Observable<any> {
    return this.client.post<any>(
      environment.gameOnApiUrl +
        '/tournament/' +
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
      environment.gameOnApiUrl +
        '/tournament/' +
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
