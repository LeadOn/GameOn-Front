import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Player } from "../classes/Player";
import { environment } from "src/environments/environment";
import { FifaPlayerStatsDto } from "../classes/FifaPlayerStatsDto";

@Injectable({
  providedIn: "root",
})
export class YuGamesPlayerService {
  constructor(private client: HttpClient) {}

  getAll(): Observable<Player[]> {
    return this.client.get<Player[]>(environment.yuGamesApiUrl + "/player/all");
  }

  get(id: number): Observable<Player> {
    return this.client.get<Player>(environment.yuGamesApiUrl + "/player/" + id);
  }

  getCurrent(): Observable<Player> {
    return this.client.get<Player>(environment.yuGamesApiUrl + "/player/me");
  }

  getStats(
    playerId: number,
    seasonId?: number
  ): Observable<FifaPlayerStatsDto> {
    let url = environment.yuGamesApiUrl + "/player/" + playerId + "/stats";

    if (seasonId != undefined && seasonId != null) {
      url += "?seasonId=" + seasonId;
    }

    return this.client.get<FifaPlayerStatsDto>(url);
  }

  update(fullName: any, nickname: any, profilePicUrl: any): Observable<Player> {
    return this.client.patch<Player>(environment.yuGamesApiUrl + "/player/me", {
      FullName: fullName,
      Nickname: nickname,
      ProfilePictureUrl: profilePicUrl,
    });
  }
}
