import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminDashboard } from '../classes/AdminDashboard';
import { Platform } from '../../../shared/classes/Platform';
import { UpdateGame } from '../classes/UpdateGame';
import { Player } from '../../../shared/classes/Player';
import { Tournament } from '../../../shared/classes/Tournament';

@Injectable({
  providedIn: 'root',
})
export class GameOnAdminService {
  constructor(private client: HttpClient) {}

  getDashboardStats(): Observable<AdminDashboard> {
    return this.client.get<AdminDashboard>(
      environment.gameOnApiUrl + '/admin/dashboard'
    );
  }

  updatePlatform(platform: Platform): Observable<Platform> {
    return this.client.patch<Platform>(
      environment.gameOnApiUrl + '/platform',
      platform
    );
  }

  deleteGame(gameId: number): Observable<any> {
    return this.client.delete<any>(
      environment.gameOnApiUrl + '/fifagame/' + gameId
    );
  }

  deleteTournament(tournamentId: number): Observable<any> {
    return this.client.delete<any>(
      environment.gameOnApiUrl + '/fifa/tournament/' + tournamentId
    );
  }

  updateGame(game: UpdateGame): Observable<any> {
    return this.client.patch<any>(environment.gameOnApiUrl + '/fifagame', game);
  }

  updatePlayer(
    id: number,
    fullName: any,
    nickname: any,
    profilePicUrl: any,
    keycloakId?: string,
    archived?: boolean
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

    if (archived != null) {
      body.Archived = archived;
    } else {
      body.Archived = false;
    }

    return this.client.patch<Player>(
      environment.gameOnApiUrl + '/player',
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
      environment.gameOnApiUrl + '/fifa/tournament',
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
    logoUrl?: string,
    phase2ChallongeUrl?: string,
    winnerId?: number,
    winPoints: number = 0,
    drawPoints: number = 0,
    loosePoints: number = 0,
    rules?: string,
    featured: boolean = false
  ): Observable<Tournament> {
    let body: any = {
      name: name,
      state: state,
      plannedFrom: plannedFrom,
      plannedTo: plannedTo,
      winnerId: winnerId,
      winPoints: winPoints,
      drawPoints: drawPoints,
      loosePoints: loosePoints,
      rules: rules,
      featured: featured,
    };

    if (description != null) {
      body.description = description;
    }

    if (logoUrl != null) {
      body.logoUrl = logoUrl;
    }

    if (phase2ChallongeUrl != null) {
      body.phase2ChallongeUrl = phase2ChallongeUrl;
    }

    return this.client.patch<Tournament>(
      environment.gameOnApiUrl + '/fifa/tournament/' + id,
      body
    );
  }

  goToPhase1(tournamentId: number): Observable<any> {
    return this.client.post<any>(
      environment.gameOnApiUrl + '/fifa/tournament/' + tournamentId + '/phase1',
      null
    );
  }

  savePhase1Score(tournamentId: number): Observable<any> {
    return this.client.post<any>(
      environment.gameOnApiUrl +
        '/fifa/tournament/' +
        tournamentId +
        '/phase1/score',
      null
    );
  }

  removeTournamentSubscription(
    tournamentId: number,
    playerId: number
  ): Observable<any> {
    return this.client.delete<any>(
      environment.gameOnApiUrl +
        '/fifa/tournament/' +
        tournamentId +
        '/player/' +
        playerId
    );
  }
}
