import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HalterodataPocService {
  constructor(private client: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.client.get(environment.gameOnApiUrl + '/admin/dashboard');
  }
}
