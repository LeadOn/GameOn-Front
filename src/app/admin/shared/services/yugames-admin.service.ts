import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AdminDashboard } from "../classes/AdminDashboard";
import { Platform } from "src/app/shared/classes/Platform";

@Injectable({
  providedIn: "root",
})
export class YuGamesAdminService {
  constructor(private client: HttpClient) {}

  getDashboardStats(): Observable<AdminDashboard> {
    return this.client.get<AdminDashboard>(
      environment.yuFootApiUrl + "/admin/dashboard"
    );
  }

  updatePlatform(platform: Platform): Observable<Platform> {
    return this.client.patch<Platform>(
      environment.yuFootApiUrl + "/platform",
      platform
    );
  }
}
