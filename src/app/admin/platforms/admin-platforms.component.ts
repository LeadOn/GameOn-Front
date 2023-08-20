import { Component, OnInit } from "@angular/core";
import { Platform } from "src/app/shared/classes/Platform";
import { YuFootPlatformService } from "src/app/shared/services/yufoot-platform.service";

@Component({
  selector: "app-admin-platforms",
  templateUrl: "./admin-platforms.component.html",
  styleUrls: ["./admin-platforms.component.scss"],
})
export class AdminPlatformsComponent implements OnInit {
  platforms: Platform[] = [];

  constructor(private platformService: YuFootPlatformService) {}

  ngOnInit(): void {
    this.platformService.getAll().subscribe(
      (data) => {
        this.platforms = data;
      },
      (err) => {
        alert(
          "Une erreur est survenue lors de la récupération des plateformes."
        );
        console.error(err);
      }
    );
  }
}
