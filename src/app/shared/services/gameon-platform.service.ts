import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Platform } from '../classes/Platform';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GameOnPlatformService {
  constructor(private client: HttpClient) {}

  getAll(): Observable<Platform[]> {
    return this.client.get<Platform[]>(environment.gameOnApiUrl + '/platform');
  }

  getById(id: number): Observable<Platform> {
    return this.client.get<Platform>(
      environment.gameOnApiUrl + '/platform/' + id
    );
  }
}
