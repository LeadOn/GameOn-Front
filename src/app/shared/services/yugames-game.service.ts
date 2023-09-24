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
      environment.yuGamesApiUrl + "/fifagame/last/" + limit
    );
  }

  search(
    limit: number,
    platformId?: number,
    startDate?: string,
    endDate?: string
  ): Observable<FifaGamePlayed[]> {
    let url = environment.yuGamesApiUrl + "/fifagame?limit=" + limit;

    if (platformId != null && platformId != 0) {
      url += "&platformId=" + platformId;
    }

    if (startDate != null && startDate != "") {
      url += "&startDate=" + startDate + "T00:00:00";
    }

    if (endDate != null && endDate != "") {
      url += "&endDate=" + endDate + "T00:00:00";
    }

    return this.client.get<FifaGamePlayed[]>(url);
  }

  getLastByPlayer(
    playerId: number,
    limit: number
  ): Observable<FifaGamePlayed[]> {
    return this.client.get<FifaGamePlayed[]>(
      environment.yuGamesApiUrl +
        "/fifagame/last/" +
        limit +
        "/player/" +
        playerId
    );
  }

  getById(gameId: number): Observable<FifaGamePlayed> {
    return this.client.get<FifaGamePlayed>(
      environment.yuGamesApiUrl + "/fifagame/" + gameId
    );
  }

  create(body: any): Observable<FifaGamePlayed> {
    return this.client.post<FifaGamePlayed>(
      environment.yuGamesApiUrl + "/fifagame",
      body
    );
  }

  getByTournament(
    tournamentId: number,
    isPlayed: boolean
  ): Observable<FifaGamePlayed[]> {
    return this.client.get<FifaGamePlayed[]>(
      environment.yuGamesApiUrl +
        "/fifagame/tournament/" +
        tournamentId +
        "?isPlayed=" +
        isPlayed
    );
  }
}
