import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Player } from "../classes/Player";
import { environment } from "src/environments/environment";
import { PlatformStats } from "../classes/PlatformStats";
import { Highlight } from "../classes/Highlight";

@Injectable({
  providedIn: "root",
})
export class YuFootHighlightService {
  constructor(private client: HttpClient) {}

  getAll(): Observable<Highlight[]> {
    return this.client.get<Highlight[]>(
      environment.yuFootApiUrl + "/highlight/all"
    );
  }
}
