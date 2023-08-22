import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FifaGamePlayed } from "../classes/FifaGamePlayed";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class YuGamesGameService {
  constructor(private client: HttpClient) {}

  getLast(limit: number): Observable<FifaGamePlayed[]> {
    return this.client.get<FifaGamePlayed[]>(
      environment.yuFootApiUrl + "/game/last/" + limit
    );
  }

  getLastByPlayer(
    playerId: number,
    limit: number
  ): Observable<FifaGamePlayed[]> {
    return this.client.get<FifaGamePlayed[]>(
      environment.yuFootApiUrl + "/game/last/" + limit + "/player/" + playerId
    );
  }

  getById(gameId: number): Observable<FifaGamePlayed> {
    return this.client.get<FifaGamePlayed>(
      environment.yuFootApiUrl + "/game/" + gameId
    );
  }

  create(body: any): Observable<FifaGamePlayed> {
    return this.client.post<FifaGamePlayed>(
      environment.yuFootApiUrl + "/game",
      body
    );
  }
}
