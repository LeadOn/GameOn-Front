import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AdminDashboard } from "../classes/AdminDashboard";
import { Platform } from "src/app/shared/classes/Platform";
import { UpdateGame } from "../classes/UpdateGame";
import { Player } from "src/app/shared/classes/Player";
import { Tournament } from "src/app/shared/classes/Tournament";

@Injectable({
  providedIn: "root",
})
export class YuGamesAdminService {
  constructor(private client: HttpClient) {}

  getDashboardStats(): Observable<AdminDashboard> {
    return this.client.get<AdminDashboard>(
      environment.yuGamesApiUrl + "/admin/dashboard"
    );
  }

  updatePlatform(platform: Platform): Observable<Platform> {
    return this.client.patch<Platform>(
      environment.yuGamesApiUrl + "/platform",
      platform
    );
  }

  deleteGame(gameId: number): Observable<any> {
    return this.client.delete<any>(
      environment.yuGamesApiUrl + "/game/" + gameId
    );
  }

  updateGame(game: UpdateGame): Observable<any> {
    return this.client.patch<any>(environment.yuGamesApiUrl + "/game", game);
  }

  updatePlayer(
    id: number,
    fullName: any,
    nickname: any,
    profilePicUrl: any,
    keycloakId?: string
  ): Observable<Player> {
    let body: any = {
      FullName: fullName,
      Nickname: nickname,
      ProfilePictureUrl: profilePicUrl,
      Id: id,
    };

    if (keycloakId != null) {
      body.KeycloakId = keycloakId;
    }

    return this.client.patch<Player>(
      environment.yuGamesApiUrl + "/player",
      body
    );
  }

  createTournament(
    name: string,
    state: number,
    plannedFrom: string,
    plannedTo: string,
    description?: string,
    logoUrl?: string
  ): Observable<Tournament> {
    let body: any = {
      name: name,
      state: state,
      plannedFrom: plannedFrom,
      plannedTo: plannedTo,
    };

    if (description != null) {
      body.description = description;
    }

    if (logoUrl != null) {
      body.logoUrl = logoUrl;
    }

    return this.client.post<Tournament>(
      environment.yuGamesApiUrl + "/tournament",
      body
    );
  }

  editTournament(
    id: number,
    name: string,
    state: number,
    plannedFrom: string,
    plannedTo: string,
    description?: string,
    logoUrl?: string
  ): Observable<Tournament> {
    let body: any = {
      name: name,
      state: state,
      plannedFrom: plannedFrom,
      plannedTo: plannedTo,
    };

    if (description != null) {
      body.description = description;
    }

    if (logoUrl != null) {
      body.logoUrl = logoUrl;
    }

    return this.client.patch<Tournament>(
      environment.yuGamesApiUrl + "/tournament/" + id,
      body
    );
  }
}
