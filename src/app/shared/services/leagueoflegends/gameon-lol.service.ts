import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayerDto } from '../../classes/PlayerDto';
import { environment } from '../../../../environments/environment';
import { LeagueOfLegendsRankHistory } from '../../classes/LeagueOfLegendsRankHistory';
import { Player } from '../../classes/Player';

@Injectable({
  providedIn: 'root',
})
export class GameOnLoLService {
  constructor(private client: HttpClient) {}

  getAll(archived?: boolean): Observable<PlayerDto[]> {
    let archivalState = false;

    if (archived != undefined && archived != null) {
      archivalState = archived;
    }

    return this.client.get<Player[]>(
      environment.gameOnApiUrl + '/summoner?archived=' + archivalState
    );
  }

  getById(id: number): Observable<PlayerDto> {
    return this.client.get<PlayerDto>(
      environment.gameOnApiUrl + '/summoner/' + id
    );
  }

  getRankHistory(
    id: number,
    limit: number
  ): Observable<LeagueOfLegendsRankHistory[]> {
    return this.client.get<LeagueOfLegendsRankHistory[]>(
      environment.gameOnApiUrl + '/summoner/' + id + '/rank?limit=' + limit
    );
  }

  refreshById(id: string): Observable<Player> {
    return this.client.patch<Player>(
      environment.gameOnApiUrl + '/summoner/' + id,
      null
    );
  }

  refreshCurrent(): Observable<Player> {
    return this.client.patch<Player>(
      environment.gameOnApiUrl + '/summoner/me',
      null
    );
  }
}
