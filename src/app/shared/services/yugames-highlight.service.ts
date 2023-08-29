import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Highlight } from "../classes/Highlight";
import { CreateHighlightDto } from "../classes/CreateHighlightDto";

@Injectable({
  providedIn: "root",
})
export class YuGamesHighlightService {
  constructor(private client: HttpClient) {}

  getAll(): Observable<Highlight[]> {
    return this.client.get<Highlight[]>(
      environment.yuGamesApiUrl + "/highlight/all"
    );
  }

  create(highlight: CreateHighlightDto): Observable<any> {
    return this.client.post<any>(
      environment.yuGamesApiUrl + "/highlight",
      highlight
    );
  }
}
