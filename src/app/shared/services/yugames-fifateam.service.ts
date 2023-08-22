import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FifaTeam } from "../classes/FifaTeam";

@Injectable({
  providedIn: "root",
})
export class YuGamesFifaTeamService {
  constructor(private client: HttpClient) {}

  getAll(): Observable<FifaTeam[]> {
    return this.client.get<FifaTeam[]>(
      environment.yuFootApiUrl + "/fifateam/all"
    );
  }
}
