import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../../classes/common/Player';
import { environment } from '../../../../environments/environment';
import { FifaPlayerStatsDto } from '../../classes/fifa/FifaPlayerStatsDto';

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
      environment.gameOnApiUrl + '/player?archived=' + archivalState,
    );
  }

  get(id: number): Observable<Player> {
    return this.client.get<Player>(environment.gameOnApiUrl + '/player/' + id);
  }

  getCurrent(): Observable<Player> {
    return this.client.get<Player>(environment.gameOnApiUrl + '/player/me');
  }

  getStats(
    playerId: number,
    seasonId?: number,
  ): Observable<FifaPlayerStatsDto> {
    let url = environment.gameOnApiUrl + '/player/' + playerId + '/stats';

    if (seasonId != undefined && seasonId != null) {
      url += '?seasonId=' + seasonId;
    }

    return this.client.get<FifaPlayerStatsDto>(url);
  }

  update(
    fullName: any,
    nickname: any,
    riotGamesNickname?: string,
    riotGamesTagLine?: string,
  ): Observable<Player> {
    return this.client.patch<Player>(environment.gameOnApiUrl + '/player/me', {
      FullName: fullName,
      Nickname: nickname,
      RiotGamesNickname: riotGamesNickname,
      RiotGamesTagLine: riotGamesTagLine,
    });
  }

  updateProfilePicture(file: any): Observable<any> {
    let formData = new FormData();
    formData.append('profilePicture', file);

    return this.client.post<any>(
      environment.gameOnApiUrl + '/player/pp',
      formData,
    );
  }
}
