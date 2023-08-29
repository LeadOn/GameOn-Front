import { Component, Input, OnInit } from "@angular/core";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { Player } from "src/app/shared/classes/Player";
import { environment } from "src/environments/environment";
import { trigger, style, animate, transition } from "@angular/animations";
import { KeycloakService } from "keycloak-angular";

@Component({
  selector: "app-profile-tab",
  templateUrl: "./profile-tab.component.html",
  styleUrls: ["./profile-tab.component.scss"],
  animations: [
    trigger("inOutAnimation", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 })),
      ]),
      transition(":leave", [
        style({ opacity: 1 }),
        animate(200, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ProfileTabComponent implements OnInit {
  @Input()
  player: Player = new Player();

  calendarIcon = faCalendar;
  isProduction = true;
  token: string = "";

  constructor(private keycloak: KeycloakService) {
    this.isProduction = environment.production;
  }

  ngOnInit(): void {
    if (this.isProduction == false) {
      this.keycloak.getToken().then((x) => {
        this.token = x;
      });
    }
  }

  logout() {
    window.location.replace(
      environment.keycloak.url + "realms/yufoot/protocol/openid-connect/logout"
    );
  }
}
