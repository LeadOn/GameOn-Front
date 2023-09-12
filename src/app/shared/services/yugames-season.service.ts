import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Season } from "../classes/Season";

@Injectable({
  providedIn: "root",
})
export class YuGamesSeasonService {
  constructor(private client: HttpClient) {}

  getCurrent(): Observable<Season> {
    return this.client.get<Season>(
      environment.yuGamesApiUrl + "/season/current"
    );
  }

  getAll(): Observable<Season[]> {
    return this.client.get<Season[]>(environment.yuGamesApiUrl + "/season");
  }
}
