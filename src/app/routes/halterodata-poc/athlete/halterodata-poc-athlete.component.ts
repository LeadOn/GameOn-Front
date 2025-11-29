import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HalterodataPocService } from '../shared/services/halterodata-poc.service';
import { AthleteDto } from '../shared/classes/AthleteDto';

@Component({
  selector: 'app-halterodata-poc-athlete',
  standalone: false,
  templateUrl: './halterodata-poc-athlete.component.html',
  styleUrl: './halterodata-poc-athlete.component.css',
})
export class HalterodataPocAthleteComponent implements OnInit {
  athleteId: any;
  athlete?: AthleteDto;

  constructor(
    private route: ActivatedRoute,
    private halterodataPocService: HalterodataPocService,
  ) {}

  ngOnInit(): void {
    this.athleteId = this.route.snapshot.paramMap.get('id');
    this.getAthlete();
  }

  getAthlete(): void {
    this.halterodataPocService.getAthleteById(this.athleteId).subscribe(
      (data) => {
        this.athlete = data;
      },
      (err) => {
        console.error('Error fetching athlete data:', err);
      },
    );
  }
}
