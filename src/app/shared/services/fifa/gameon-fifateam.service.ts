import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FifaTeam } from '../../classes/fifa/FifaTeam';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GameOnFifaTeamService {
  constructor(private client: HttpClient) {}

  getAll(): Observable<FifaTeam[]> {
    return this.client.get<FifaTeam[]>(
      environment.gameOnApiUrl + '/fifa/fifateam',
    );
  }
}
