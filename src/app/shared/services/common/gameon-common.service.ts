import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HomeDataDto } from '../../classes/common/HomeDataDto';

@Injectable({
  providedIn: 'root',
})
export class GameOnCommonService {
  baseUrl = environment.gameOnApiUrl + '/common';

  constructor(private client: HttpClient) {}

  getHomeData(): Observable<HomeDataDto> {
    return this.client.get<HomeDataDto>(this.baseUrl + '/home');
  }
}
