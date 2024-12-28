import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GameOnSoccerfiveService } from '../../shared/services/gameon-soccerfive.service';

@Component({
  selector: 'app-five-create',
  templateUrl: './five-create.component.html',
  styleUrls: ['./five-create.component.scss'],
})
export class CreateFiveComponent implements OnInit {
  isLoading = false;

  createFiveForm = new FormGroup({
    name: new FormControl('', [Validators.maxLength(100)]),
    description: new FormControl('', [Validators.maxLength(200)]),
    plannedOn: new FormControl(new Date()),
  });

  constructor(
    private router: Router,
    private fiveService: GameOnSoccerfiveService
  ) {}

  ngOnInit(): void {}

  createFive() {
    this.isLoading = true;

    let name = undefined;
    let description = undefined;

    if (
      this.createFiveForm.controls['name'].value != null &&
      this.createFiveForm.controls['name'].value != ''
    ) {
      name = this.createFiveForm.controls['name'].value;
    }

    if (
      this.createFiveForm.controls['description'].value != null &&
      this.createFiveForm.controls['description'].value != ''
    ) {
      description = this.createFiveForm.controls['description'].value;
    }

    this.fiveService.create(name, description, undefined).subscribe(
      (data) => {
        this.router.navigate(['/soccerfive']);
        this.isLoading = false;
      },
      (err) => {
        alert('Erreur lors de la création du five !');
        this.isLoading = false;
      }
    );
  }
}
