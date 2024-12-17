import { Component } from '@angular/core';
import { faBitcoinSign } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrl: './donate.component.scss',
})
export class DonateComponent {
  btcIcon = faBitcoinSign;
}