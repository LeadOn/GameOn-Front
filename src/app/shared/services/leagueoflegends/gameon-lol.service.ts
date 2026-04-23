import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Player } from '../../classes/common/Player';
import { PlayerDto } from '../../classes/common/PlayerDto';
import { LeagueOfLegendsRankHistory } from '../../classes/lol/LeagueOfLegendsRankHistory';
import { LoLGame } from '../../classes/lol/LoLGame';
import { LoLGameTimelineFrame } from '../../classes/lol/LoLGameTimelineFrame';
import { ListResultDto } from '../../classes/common/ListResultDto';

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

  refreshAllRanks(): Observable<any> {
    return this.client.patch<any>(
      environment.gameOnApiUrl + '/lol/summoner/ranks',
      null,
    );
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

  getLastGamesPlayedByPlayer(
    playerId: number,
    page: number = 1,
    size: number = 10,
    rankedOnly: boolean = false,
  ): Observable<ListResultDto<LoLGame>> {
    return this.client.get<ListResultDto<LoLGame>>(
      environment.gameOnApiUrl +
        '/lol/match/player/' +
        playerId +
        '?page=' +
        page +
        '&size=' +
        size +
        '&rankedOnly=' +
        rankedOnly,
    );
  }

  refreshGame(matchId: string): Observable<LoLGame> {
    return this.client.post<LoLGame>(
      environment.gameOnApiUrl + '/lol/match/' + matchId + '/update',
      null,
    );
  }
}
