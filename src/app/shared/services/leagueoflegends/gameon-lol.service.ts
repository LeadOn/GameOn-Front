import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayerDto } from '../../classes/PlayerDto';
import { environment } from '../../../../environments/environment';
import { LeagueOfLegendsRankHistory } from '../../classes/LeagueOfLegendsRankHistory';
import { Player } from '../../classes/Player';
import { LoLGame } from '../../classes/LoLGame';

@Injectable({
  providedIn: 'root',
})
export class GameOnLoLService {
  baseUrl = environment.gameOnApiUrl + '/lol/summoner';

  constructor(private client: HttpClient) {}

  getAll(archived?: boolean): Observable<PlayerDto[]> {
    let archivalState = false;

    if (archived != undefined && archived != null) {
      archivalState = archived;
    }

    return this.client.get<Player[]>(
      this.baseUrl + '?archived=' + archivalState
    );
  }

  getById(id: number): Observable<PlayerDto> {
    return this.client.get<PlayerDto>(this.baseUrl + '/' + id);
  }

  getRankHistory(
    id: number,
    limit: number
  ): Observable<LeagueOfLegendsRankHistory[]> {
    return this.client.get<LeagueOfLegendsRankHistory[]>(
      this.baseUrl + '/' + id + '/rank?limit=' + limit
    );
  }

  refreshById(id: string): Observable<Player> {
    return this.client.patch<Player>(this.baseUrl + '/' + id, null);
  }

  refreshCurrent(): Observable<Player> {
    return this.client.patch<Player>(this.baseUrl + '/me', null);
  }

  getGame(id: string): Observable<LoLGame> {
    return this.client.get<LoLGame>(
      environment.gameOnApiUrl + '/lol/match/' + id
    );
  }

  getLastGamesPlayed(id: number): Observable<LoLGame[]> {
    return this.client.get<LoLGame[]>(
      environment.gameOnApiUrl + '/lol/match/player/' + id
    );
  }

  refreshGame(matchId: string): Observable<any> {
    return this.client.post<any>(
      environment.gameOnApiUrl + '/lol/match/' + matchId + '/update',
      null
    );
  }
}
