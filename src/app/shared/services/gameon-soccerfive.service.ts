import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SoccerFive } from '../classes/SoccerFive';

@Injectable({
  providedIn: 'root',
})
export class GameOnSoccerfiveService {
  constructor(private client: HttpClient) {}

  getAll(): Observable<SoccerFive[]> {
    return this.client.get<SoccerFive[]>(
      environment.gameOnApiUrl + '/soccerfive'
    );
  }

  create(
    name?: string,
    description?: string,
    plannedOn?: string
  ): Observable<SoccerFive> {
    return this.client.post<SoccerFive>(
      environment.gameOnApiUrl + '/soccerfive',
      {
        name,
        description,
        plannedOn,
      }
    );
  }

  getStates(): any[] {
    return [
      {
        value: 0,
        label: 'Brouillon',
      },
      {
        value: 1,
        label: 'Planifié',
      },
      {
        value: 2,
        label: 'Terminé',
      },
    ];
  }
}
