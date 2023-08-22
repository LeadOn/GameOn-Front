import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Player } from "../classes/Player";
import { environment } from "src/environments/environment";
import { PlatformStats } from "../classes/PlatformStats";

@Injectable({
  providedIn: "root",
})
export class YuGamesPlayerService {
  constructor(private client: HttpClient) {}

  getAll(): Observable<Player[]> {
    return this.client.get<Player[]>(environment.yuFootApiUrl + "/player/all");
  }

  get(id: number): Observable<Player> {
    return this.client.get<Player>(environment.yuFootApiUrl + "/player/" + id);
  }

  getCurrent(): Observable<Player> {
    return this.client.get<Player>(environment.yuFootApiUrl + "/player/me");
  }

  getStats(playerId: number): Observable<PlatformStats[]> {
    return this.client.get<PlatformStats[]>(
      environment.yuFootApiUrl + "/player/" + playerId + "/stats"
    );
  }

  update(fullName: any, nickname: any, profilePicUrl: any): Observable<Player> {
    return this.client.patch<Player>(environment.yuFootApiUrl + "/player/me", {
      FullName: fullName,
      Nickname: nickname,
      ProfilePictureUrl: profilePicUrl,
    });
  }
}
