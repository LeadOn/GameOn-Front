import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Tournament } from "../classes/Tournament";

@Injectable({
  providedIn: "root",
})
export class YuGamesTournamentService {
  constructor(private client: HttpClient) {}

  getAll(): Observable<Tournament[]> {
    return this.client.get<Tournament[]>(
      environment.yuGamesApiUrl + "/tournament"
    );
  }

  getById(id: number): Observable<Tournament> {
    return this.client.get<Tournament>(
      environment.yuGamesApiUrl + "/tournament/" + id
    );
  }

  checkPlayerSubscription(id: number): Observable<Tournament> {
    return this.client.get<Tournament>(
      environment.yuGamesApiUrl + "/tournament/" + id + "/subscription"
    );
  }

  subscribe(id: number, fifaTeamId: number): Observable<any> {
    return this.client.post<any>(
      environment.yuGamesApiUrl +
        "/tournament/" +
        id +
        "/subscription?fifaTeamId=" +
        fifaTeamId,
      null
    );
  }

  getStates(): any[] {
    return [
      {
        value: 0,
        label: "Brouillon",
      },
      {
        value: 1,
        label: "Planifié",
      },
      {
        value: 2,
        label: "Phase 1",
      },
    ];
  }
}
