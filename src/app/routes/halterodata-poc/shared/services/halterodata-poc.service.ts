import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AthleteDto } from '../classes/AthleteDto';
import { CompetitionDto } from '../classes/CompetitionDto';
import { PaginatedResponse } from '../classes/PaginatedResponse';
import { CompetitionSearchResultDto } from '../classes/CompetitionSearchResultDto';

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

  getCompetitions(page: number = 1, size: number = 10, keywords?: string) {
    return this.client.get<CompetitionSearchResultDto>(
      environment.halterodataApiUrl +
        '/competition?page=' +
        page +
        '&size=' +
        size +
        (keywords ? '&keywords=' + keywords : ''),
    );
  }
}
