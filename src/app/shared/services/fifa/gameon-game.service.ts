import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FifaGamePlayed } from '../../classes/fifa/FifaGamePlayed';
import { environment } from '../../../../environments/environment';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class GameOnGameService {
  constructor(private client: HttpClient, private keycloak: KeycloakService) {}

  getLast(limit: number): Observable<FifaGamePlayed[]> {
    return this.client.get<FifaGamePlayed[]>(
      environment.gameOnApiUrl + '/fifa/fifagame/last/' + limit
    );
  }

  getPlanned(playerId: number, limit: number): Observable<FifaGamePlayed[]> {
    return this.client.get<FifaGamePlayed[]>(
      environment.gameOnApiUrl +
        '/fifa/fifagame/planned/' +
        playerId +
        '?limit=' +
        limit
    );
  }

  search(
    limit: number,
    platformId?: number,
    startDate?: string,
    endDate?: string
  ): Observable<FifaGamePlayed[]> {
    let url = environment.gameOnApiUrl + '/fifa/fifagame?limit=' + limit;

    if (platformId != null && platformId != 0) {
      url += '&platformId=' + platformId;
    }

    if (startDate != null && startDate != '') {
      url += '&startDate=' + startDate + 'T00:00:00';
    }

    if (endDate != null && endDate != '') {
      url += '&endDate=' + endDate + 'T00:00:00';
    }

    return this.client.get<FifaGamePlayed[]>(url);
  }

  getLastByPlayer(
    playerId: number,
    limit: number
  ): Observable<FifaGamePlayed[]> {
    return this.client.get<FifaGamePlayed[]>(
      environment.gameOnApiUrl +
        '/fifa/fifagame/last/' +
        limit +
        '/player/' +
        playerId
    );
  }

  getById(gameId: number): Observable<FifaGamePlayed> {
    return this.client.get<FifaGamePlayed>(
      environment.gameOnApiUrl + '/fifa/fifagame/' + gameId
    );
  }

  create(body: any): Observable<FifaGamePlayed> {
    return this.client.post<FifaGamePlayed>(
      environment.gameOnApiUrl + '/fifa/fifagame',
      body
    );
  }

  getByTournament(
    tournamentId: number,
    isPlayed: boolean
  ): Observable<FifaGamePlayed[]> {
    return this.client.get<FifaGamePlayed[]>(
      environment.gameOnApiUrl +
        '/fifa/fifagame/tournament/' +
        tournamentId +
        '?isPlayed=' +
        isPlayed
    );
  }

  deleteGame(gameId: number): Observable<any> {
    if (
      this.keycloak.isLoggedIn() == true &&
      this.keycloak.isUserInRole('gameon_admin')
    ) {
      return this.client.delete<any>(
        environment.gameOnApiUrl + '/fifa/fifagame/' + gameId
      );
    }

    return new Observable();
  }
}
