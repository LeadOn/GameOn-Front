import { Component, OnInit } from "@angular/core";
import { Platform } from "src/app/shared/classes/Platform";
import { YuGamesPlatformService } from "src/app/shared/services/yugames-platform.service";

@Component({
  selector: "app-admin-platforms",
  templateUrl: "./admin-platforms.component.html",
  styleUrls: ["./admin-platforms.component.scss"],
})
export class AdminPlatformsComponent implements OnInit {
  platforms: Platform[] = [];
  loading = true;

  constructor(private platformService: YuGamesPlatformService) {}

  ngOnInit(): void {
    this.platformService.getAll().subscribe(
      (data) => {
        this.platforms = data;
        this.loading = false;
      },
      (err) => {
        alert(
          "Une erreur est survenue lors de la récupération des plateformes."
        );
        console.error(err);
        this.loading = false;
      }
    );
  }
}
