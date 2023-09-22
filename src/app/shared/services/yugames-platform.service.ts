import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Platform } from "../classes/Platform";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class YuGamesPlatformService {
  constructor(private client: HttpClient) {}

  getAll(): Observable<Platform[]> {
    return this.client.get<Platform[]>(
      environment.yuGamesApiUrl + "/platform/all"
    );
  }

  getById(id: number): Observable<Platform> {
    return this.client.get<Platform>(
      environment.yuGamesApiUrl + "/platform/" + id
    );
  }
}
