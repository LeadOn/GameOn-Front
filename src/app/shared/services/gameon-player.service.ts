import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../../shared/classes/Player';
import { environment } from '../../../environments/environment';
import { FifaPlayerStatsDto } from '../../shared/classes/FifaPlayerStatsDto';
import { GlobalStatsDto } from '../../shared/classes/GlobalStatsDto';
import { PlayerDto } from '../classes/PlayerDto';

@Injectable({
  providedIn: 'root',
})
export class GameOnPlayerService {
  constructor(private client: HttpClient) {}

  getAll(archived?: boolean): Observable<Player[]> {
    let archivalState = false;

    if (archived != undefined && archived != null) {
      archivalState = archived;
    }

    return this.client.get<Player[]>(
      environment.gameOnApiUrl + '/player?archived=' + archivalState
    );
  }

  getAllLol(archived?: boolean): Observable<PlayerDto[]> {
    let archivalState = false;

    if (archived != undefined && archived != null) {
      archivalState = archived;
    }

    return this.client.get<Player[]>(
      environment.gameOnApiUrl + '/player/lol?archived=' + archivalState
    );
  }

  get(id: number): Observable<Player> {
    return this.client.get<Player>(environment.gameOnApiUrl + '/player/' + id);
  }

  getSummoner(id: number): Observable<PlayerDto> {
    return this.client.get<PlayerDto>(
      environment.gameOnApiUrl + '/player/' + id + '/lol'
    );
  }

  getCurrent(): Observable<Player> {
    return this.client.get<Player>(environment.gameOnApiUrl + '/player/me');
  }

  getStats(
    playerId: number,
    seasonId?: number
  ): Observable<FifaPlayerStatsDto> {
    let url = environment.gameOnApiUrl + '/player/' + playerId + '/stats';

    if (seasonId != undefined && seasonId != null) {
      url += '?seasonId=' + seasonId;
    }

    return this.client.get<FifaPlayerStatsDto>(url);
  }

  getGlobalStats(): Observable<GlobalStatsDto> {
    return this.client.get<GlobalStatsDto>(
      environment.gameOnApiUrl + '/player/global/stats'
    );
  }

  update(
    fullName: any,
    nickname: any,
    profilePicUrl: any,
    riotGamesNickname?: string,
    riotGamesTagLine?: string
  ): Observable<Player> {
    return this.client.patch<Player>(environment.gameOnApiUrl + '/player/me', {
      FullName: fullName,
      Nickname: nickname,
      ProfilePictureUrl: profilePicUrl,
      RiotGamesNickname: riotGamesNickname,
      RiotGamesTagLine: riotGamesTagLine,
    });
  }

  refreshSummoner(): Observable<Player> {
    return this.client.patch<Player>(
      environment.gameOnApiUrl + '/player/me/summoner',
      null
    );
  }

  refreshSummonerById(id: string): Observable<Player> {
    return this.client.patch<Player>(
      environment.gameOnApiUrl + '/player/' + id + '/summoner',
      null
    );
  }
}
