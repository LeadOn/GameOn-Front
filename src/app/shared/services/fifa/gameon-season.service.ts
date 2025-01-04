import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Season } from '../../classes/fifa/Season';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GameOnSeasonService {
  baseControllerUrl = environment.gameOnApiUrl + '/fifa/season';

  constructor(private client: HttpClient) {}

  getCurrent(): Observable<Season> {
    return this.client.get<Season>(this.baseControllerUrl + '/current');
  }

  getAll(): Observable<Season[]> {
    return this.client.get<Season[]>(this.baseControllerUrl);
  }
}
