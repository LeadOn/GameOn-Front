import { Component, OnInit } from '@angular/core';
import { CompetitionDto } from '../shared/classes/CompetitionDto';
import { AthleteDto } from '../shared/classes/AthleteDto';
import { StatRecapDto } from '../shared/classes/StatRecapDto';
import { HalterodataPocService } from '../shared/services/halterodata-poc.service';

@Component({
  selector: 'app-halterodata-poc-home',
  standalone: false,
  templateUrl: './halterodata-poc-home.component.html',
  styleUrl: './halterodata-poc-home.component.css',
})
export class HalterodataPocHomeComponent implements OnInit {
  competitions: CompetitionDto[] = [];
  filteredCompetitions: CompetitionDto[] = [];
  displayedCompetitions: CompetitionDto[] = [];
  loading: boolean = false;
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 20;
  totalItems: number = 0;
  totalPages: number = 0;

  // Athlètes épinglés
  pinnedAthletes: AthleteDto[] = [];
  allCompetitions: CompetitionDto[] = [];

  constructor(private halterodataPocService: HalterodataPocService) {}

  ngOnInit(): void {
    this.loadPinnedAthletes();
    this.loadCompetitions();
  }

  loadPinnedAthletes(): void {
    // Grégoire Aubertin (ID: 4210)
    this.halterodataPocService.getAthleteById(4210).subscribe(
      (data) => {
        this.halterodataPocService.getAthleteById(1).subscribe(
          (data2) => {
            this.pinnedAthletes = [data, data2];
          },
          (err2) => {
            console.error('Error fetching athlete data:', err2);
          },
        );
      },
      (err) => {
        console.error('Error fetching athlete data:', err);
      },
    );
  }

  changePage(page: number): void {
    if (page <= 0 || page >= this.totalPages) return;

    this.currentPage = page;
    this.loadCompetitions();
  }

  onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.currentPage = 1;
    this.loadCompetitions();
  }

  loadCompetitions(): void {
    this.loading = true;

    this.halterodataPocService
      .getCompetitions(this.currentPage, this.pageSize)
      .subscribe(
        (data) => {
          this.currentPage = data.page;
          this.pageSize = data.resultsPerPage;
          this.totalItems = data.total;
          this.totalPages = Math.ceil(data.total / data.resultsPerPage);
          this.competitions = data.results;
          this.loading = false;
        },
        (err) => {
          console.error('Error fetching competitions:', err);
        },
      );
  }

  formatDate(date?: Date | string): string {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  }

  getStatusBadgeClass(state: number): string {
    switch (state) {
      case 1: // Terminée
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 0: // En cours
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-[#a8b2d2]/20 text-[#a8b2d2] border-[#a8b2d2]/30';
    }
  }

  getStatusLabel(state: number): string {
    switch (state) {
      case 1:
        return 'Terminée';
      case 0:
        return 'En cours';
      default:
        return 'Inconnu';
    }
  }

  getGenderLabel(gender: number): string {
    switch (gender) {
      case 0:
        return 'Masculin';
      case 1:
        return 'Féminin';
      case 2:
        return 'Mixte';
      default:
        return 'N/A';
    }
  }

  getTypeLabel(type: boolean): string {
    return type ? 'En équipe' : 'Individuelle';
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  getVisiblePages(): (number | 'ellipsis')[] {
    const pages: (number | 'ellipsis')[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      // Si moins de 7 pages, afficher toutes
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Toujours afficher la première page
    pages.push(1);

    if (current <= 3) {
      // Près du début
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(total);
    } else if (current >= total - 3) {
      // Près de la fin
      pages.push('ellipsis');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Au milieu
      pages.push('ellipsis');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(total);
    }

    return pages;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }
}
