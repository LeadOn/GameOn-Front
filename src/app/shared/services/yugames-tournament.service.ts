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
}
