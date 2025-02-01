import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Player } from '../../classes/common/Player';
import { PlayerDto } from '../../classes/common/PlayerDto';
import { LeagueOfLegendsRankHistory } from '../../classes/lol/LeagueOfLegendsRankHistory';
import { LoLGame } from '../../classes/lol/LoLGame';
import { LoLGameTimelineFrame } from '../../classes/lol/LoLGameTimelineFrame';

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
      this.baseUrl + '?archived=' + archivalState,
    );
  }

  getById(id: number): Observable<PlayerDto> {
    return this.client.get<PlayerDto>(this.baseUrl + '/' + id);
  }

  getRankHistory(
    id: number,
    limit: number,
  ): Observable<LeagueOfLegendsRankHistory[]> {
    return this.client.get<LeagueOfLegendsRankHistory[]>(
      this.baseUrl + '/' + id + '/rank?limit=' + limit,
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
      environment.gameOnApiUrl + '/lol/match/' + id,
    );
  }

  getGameTimeline(id: string): Observable<LoLGameTimelineFrame[]> {
    return this.client.get<LoLGameTimelineFrame[]>(
      environment.gameOnApiUrl + '/lol/match/' + id + '/timeline',
    );
  }

  getLastGamesPlayed(id: number): Observable<LoLGame[]> {
    return this.client.get<LoLGame[]>(
      environment.gameOnApiUrl + '/lol/match/player/' + id,
    );
  }

  refreshGame(matchId: string): Observable<LoLGame> {
    return this.client.post<LoLGame>(
      environment.gameOnApiUrl + '/lol/match/' + matchId + '/update',
      null,
    );
  }
}
