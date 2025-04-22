import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Changelog } from '../../classes/common/Changelog';

@Injectable({
  providedIn: 'root',
})
export class GameOnChangelogService {
  constructor(private client: HttpClient) {}

  getAll(): Observable<Changelog[]> {
    return this.client.get<Changelog[]>(
      environment.gameOnApiUrl + '/changelog',
    );
  }

  getLatest(): Observable<Changelog> {
    return this.client.get<Changelog>(
      environment.gameOnApiUrl + '/changelog/latest',
    );
  }

  get(id: number): Observable<Changelog> {
    return this.client.get<Changelog>(
      environment.gameOnApiUrl + '/changelog/' + id,
    );
  }
}
