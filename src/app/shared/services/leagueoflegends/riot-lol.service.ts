import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RiotLoLService {
  constructor(private client: HttpClient) {}

  getPatchs(): Observable<string[]> {
    return this.client.get<string[]>(
      'https://ddragon.leagueoflegends.com/api/versions.json',
    );
  }
}
