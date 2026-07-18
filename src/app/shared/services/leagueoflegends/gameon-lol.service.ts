import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Player } from '../../classes/common/Player';
import { PlayerDto } from '../../classes/common/PlayerDto';
import {
  LeagueOfLegendsRankHistory,
  LoLRankHistoryGranularity,
} from '../../classes/lol/LeagueOfLegendsRankHistory';
import { LoLGame } from '../../classes/lol/LoLGame';
import { LoLGameTimelineFrame } from '../../classes/lol/LoLGameTimelineFrame';
import { LoLQueue } from '../../classes/lol/LoLQueue';
import { ListResultDto } from '../../classes/common/ListResultDto';
import {
  GlobalStatsFilters,
  LoLGlobalStatsDto,
} from '../../classes/lol/LoLGlobalStats';

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
    granularity?: LoLRankHistoryGranularity,
    days?: number,
  ): Observable<LeagueOfLegendsRankHistory[]> {
    let params = new HttpParams();

    if (granularity != null) {
      params = params.set('granularity', granularity);

      if (days != null) {
        params = params.set('days', days);
      }
    } else {
      params = params.set('limit', limit);
    }

    return this.client.get<LeagueOfLegendsRankHistory[]>(
      this.baseUrl + '/' + id + '/rank',
      { params },
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
    queueIds?: number[] | null,
  ): Observable<ListResultDto<LoLGame>> {
    let url =
      environment.gameOnApiUrl +
      '/lol/match/player/' +
      playerId +
      '?page=' +
      page +
      '&size=' +
      size +
      '&rankedOnly=' +
      rankedOnly;

    if (queueIds != null && queueIds.length > 0) {
      url += '&queues=' + queueIds.join(',');
    }

    return this.client.get<ListResultDto<LoLGame>>(url);
  }

  getQueues(): Observable<LoLQueue[]> {
    return this.client.get<LoLQueue[]>(
      environment.gameOnApiUrl + '/lol/queue',
    );
  }

  getQueuesForPlayer(playerId: number): Observable<LoLQueue[]> {
    return this.client.get<LoLQueue[]>(
      environment.gameOnApiUrl + '/lol/queue/player/' + playerId,
    );
  }

  refreshGame(matchId: string): Observable<LoLGame> {
    return this.client.post<LoLGame>(
      environment.gameOnApiUrl + '/lol/match/' + matchId + '/update',
      null,
    );
  }

  importGame(matchId: string): Observable<LoLGame> {
    return this.client.post<LoLGame>(
      environment.gameOnApiUrl + '/lol/match/' + matchId + '/import',
      null,
    );
  }

  getGlobalStats(filters?: GlobalStatsFilters): Observable<LoLGlobalStatsDto> {
    let params = new HttpParams();

    if (filters?.rankedOnly === true) {
      params = params.set('rankedOnly', 'true');
    }

    if (filters?.queue != null && filters.queue !== 'All') {
      params = params.set('queue', filters.queue);
    }

    if (filters?.period != null && filters.period !== 'AllTime') {
      params = params.set('period', filters.period);
    }

    return this.client.get<LoLGlobalStatsDto>(
      environment.gameOnApiUrl + '/lol/Stats/global',
      { params },
    );
  }
}
