import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AthleteDto } from '../classes/AthleteDto';

@Injectable({
  providedIn: 'root',
})
export class HalterodataPocService {
  constructor(private client: HttpClient) {}

  getAthleteById(id: number): Observable<AthleteDto> {
    return this.client.get<AthleteDto>(
      environment.halterodataApiUrl + '/athlete/' + id,
    );
  }
}
