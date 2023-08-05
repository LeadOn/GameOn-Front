import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Player } from "src/app/classes/Player";
import { GamePlayed } from "src/app/classes/GamePlayed";
import { environment } from "src/environments/environment";

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
}
