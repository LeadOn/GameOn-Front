import { Component, OnInit } from '@angular/core';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-home-lol',
  templateUrl: './home-lol.component.html',
  styleUrl: './home-lol.component.css',
  standalone: false,
})
export class HomeLolComponent implements OnInit {
  lolVersion$: Observable<string>;

  lolVersion = '';
  externalIcon = faExternalLink;

  constructor(private lolStore: Store<{ lolVersion: string }>) {
    this.lolVersion$ = this.lolStore.select('lolVersion');
  }

  ngOnInit(): void {
    this.lolVersion$.subscribe((version) => {
      this.lolVersion = version;
    });
  }
}
