import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Player } from "../classes/Player";
import { environment } from "src/environments/environment";
import { PlatformStats } from "../classes/PlatformStats";
import { TopTeamStatDto } from "../classes/TopTeamStatDto";

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

  getStats(playerId: number): Observable<PlatformStats[]> {
    return this.client.get<PlatformStats[]>(
      environment.yuGamesApiUrl + "/player/" + playerId + "/stats"
    );
  }

  update(fullName: any, nickname: any, profilePicUrl: any): Observable<Player> {
    return this.client.patch<Player>(environment.yuGamesApiUrl + "/player/me", {
      FullName: fullName,
      Nickname: nickname,
      ProfilePictureUrl: profilePicUrl,
    });
  }

  getMostPlayedTeams(
    playerId: number,
    numberOfTeams: number
  ): Observable<TopTeamStatDto[]> {
    return this.client.get<TopTeamStatDto[]>(
      environment.yuGamesApiUrl +
        "/player/" +
        playerId +
        "/mostplayedteams?numberOfTeams=" +
        numberOfTeams
    );
  }
}
