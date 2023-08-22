import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Highlight } from "../classes/Highlight";

@Injectable({
  providedIn: "root",
})
export class YuGamesHighlightService {
  constructor(private client: HttpClient) {}

  getAll(): Observable<Highlight[]> {
    return this.client.get<Highlight[]>(
      environment.yuFootApiUrl + "/highlight/all"
    );
  }
}
