import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Highlight } from '../classes/Highlight';
import { CreateHighlightDto } from '../classes/CreateHighlightDto';

@Injectable({
  providedIn: 'root',
})
export class GameOnHighlightService {
  constructor(private client: HttpClient) {}

  getAll(): Observable<Highlight[]> {
    return this.client.get<Highlight[]>(
      environment.gameOnApiUrl + '/highlight'
    );
  }

  create(highlight: CreateHighlightDto): Observable<any> {
    return this.client.post<any>(
      environment.gameOnApiUrl + '/highlight',
      highlight
    );
  }
}
