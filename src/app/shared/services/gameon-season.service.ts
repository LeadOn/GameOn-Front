import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Season } from '../classes/Season';

@Injectable({
  providedIn: 'root',
})
export class GameOnSeasonService {
  constructor(private client: HttpClient) {}

  getCurrent(): Observable<Season> {
    return this.client.get<Season>(
      environment.gameOnApiUrl + '/season/current'
    );
  }

  getAll(): Observable<Season[]> {
    return this.client.get<Season[]>(environment.gameOnApiUrl + '/season');
  }
}
