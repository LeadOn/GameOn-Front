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

  // Tri
  sortField: string = 'date'; // Colonne de tri par défaut
  sortOrder: 'asc' | 'desc' = 'desc'; // Ordre de tri par défaut (du plus récent au plus ancien)

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
    if (page <= 0 || page > this.totalPages) return;

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
      .getCompetitions(
        this.currentPage,
        this.pageSize,
        this.searchTerm != '' ? this.searchTerm : undefined,
      )
      .subscribe(
        (data) => {
          this.currentPage = data.page;
          this.pageSize = data.resultsPerPage;
          this.totalItems = data.total;
          this.totalPages = Math.ceil(data.total / data.resultsPerPage);
          this.competitions = data.results;
          this.sortCompetitions();
          this.loading = false;
        },
        (err) => {
          console.error('Error fetching competitions:', err);
        },
      );
  }

  sortCompetitions(): void {
    this.competitions.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'league':
          aValue = a.league.toLowerCase();
          bValue = b.league.toLowerCase();
          break;
        case 'gender':
          aValue = a.gender;
          bValue = b.gender;
          break;
        case 'type':
          aValue = a.type ? 1 : 0;
          bValue = b.type ? 1 : 0;
          break;
        case 'state':
          aValue = a.state;
          bValue = b.state;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return this.sortOrder === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return this.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  sortBy(field: string): void {
    // Si on clique sur la même colonne, inverser l'ordre
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Sinon, définir le nouveau champ de tri avec l'ordre ascendant par défaut
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    // Trier les compétitions localement sans recharger les données
    this.sortCompetitions();
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
