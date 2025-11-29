import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-halterodata-poc-athlete',
  standalone: false,
  templateUrl: './halterodata-poc-athlete.component.html',
  styleUrl: './halterodata-poc-athlete.component.css',
})
export class HalterodataPocAthleteComponent implements OnInit {
  athleteId: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.athleteId = this.route.snapshot.paramMap.get('id');
  }
}
