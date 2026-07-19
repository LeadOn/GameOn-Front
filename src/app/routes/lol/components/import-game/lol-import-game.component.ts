import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import { GameOnLoLService } from '../../../../shared/services/leagueoflegends/gameon-lol.service';

@Component({
  selector: 'app-lol-import-game',
  templateUrl: './lol-import-game.component.html',
  standalone: false,
})
export class LolImportGameComponent implements AfterViewInit, OnDestroy {
  @Input()
  isLoggedIn: boolean = false;

  @ViewChild('overlay')
  overlayRef?: ElementRef<HTMLElement>;

  importIcon = faFileImport;

  modalOpen = false;
  matchId = '';
  importing = false;

  feedbackOpen = false;
  feedbackType: 'success' | 'error' = 'success';
  feedbackTitle = '';
  feedbackMessage = '';

  constructor(private lolService: GameOnLoLService) {}

  ngAfterViewInit(): void {
    // Re-parented to <body> so this full-screen overlay can never get
    // trapped behind an ancestor that establishes its own stacking context
    // (e.g. CommonLayoutComponent's positioned/z-indexed background wrapper).
    if (this.overlayRef) {
      document.body.appendChild(this.overlayRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.overlayRef?.nativeElement.remove();
  }

  openModal() {
    if (!this.isLoggedIn || this.importing) return;

    this.matchId = '';
    this.modalOpen = true;
  }

  closeModal() {
    if (this.importing) return;

    this.modalOpen = false;
  }

  importGame() {
    const matchId = this.matchId.trim();

    if (matchId === '' || this.importing) return;

    this.importing = true;

    this.lolService.importGame(matchId).subscribe(
      () => {
        this.importing = false;
        this.modalOpen = false;
        this.showFeedback(
          'success',
          'Partie importée',
          'La partie a été importée avec succès.',
        );
      },
      (err) => {
        console.error(err);
        this.importing = false;
        this.showFeedback(
          'error',
          'Partie introuvable',
          "Aucune partie n'a été trouvée avec cet identifiant sur les serveurs Riot Games. Vérifiez l'identifiant renseigné.",
        );
      },
    );
  }

  showFeedback(type: 'success' | 'error', title: string, message: string) {
    this.feedbackType = type;
    this.feedbackTitle = title;
    this.feedbackMessage = message;
    this.feedbackOpen = true;
  }

  closeFeedback() {
    this.feedbackOpen = false;
  }
}
