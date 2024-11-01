import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Changelog } from '../classes/Changelog';

@Injectable({
  providedIn: 'root',
})
export class GameOnChangelogService {
  constructor(private client: HttpClient) {}

  getAll(): Observable<Changelog[]> {
    return this.client.get<Changelog[]>(
      environment.gameOnApiUrl + '/changelog'
    );
  }
}
