import { Component, OnInit } from "@angular/core";
import { initFlowbite } from "flowbite";

@Component({
  selector: "app-common-layout",
  templateUrl: "./common-layout.component.html",
  styleUrls: ["./common-layout.component.scss"],
})
export class CommonLayoutComponent implements OnInit {
  ngOnInit(): void {
    initFlowbite();
  }
}
