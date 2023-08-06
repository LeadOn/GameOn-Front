import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, ObservableLike } from "rxjs";
import { Player } from "src/app/classes/Player";
import { GamePlayed } from "src/app/classes/GamePlayed";
import { environment } from "src/environments/environment";
import { Platform } from "../classes/Platform";

@Injectable({
  providedIn: "root",
})
export class YuFootApiService {
  constructor(private client: HttpClient) {}

  getPlayers(): Observable<Player[]> {
    return this.client.get<Player[]>(environment.yuFootApiUrl + "/player");
  }

  getLastGamesPlayed(limit: number): Observable<GamePlayed[]> {
    return this.client.get<GamePlayed[]>(
      environment.yuFootApiUrl + "/game/last/" + limit
    );
  }

  getPlayer(id: number): Observable<Player> {
    return this.client.get<Player>(environment.yuFootApiUrl + "/player/" + id);
  }

  getCurrentUser(): Observable<Player> {
    return this.client.get<Player>(environment.yuFootApiUrl + "/player/me");
  }

  updateUser(
    fullName: any,
    nickname: any,
    profilePicUrl: any
  ): Observable<Player> {
    return this.client.patch<Player>(environment.yuFootApiUrl + "/player/me", {
      FullName: fullName,
      Nickname: nickname,
      ProfilePictureUrl: profilePicUrl,
    });
  }

  getPlatforms(): Observable<Platform[]> {
    return this.client.get<Platform[]>(environment.yuFootApiUrl + "/platform");
  }

  createGame(body: any): Observable<GamePlayed> {
    return this.client.post<GamePlayed>(
      environment.yuFootApiUrl + "/game/create",
      body
    );
  }
}
