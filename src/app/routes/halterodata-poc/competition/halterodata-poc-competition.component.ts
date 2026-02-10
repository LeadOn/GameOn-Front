import { Component, OnInit } from '@angular/core';
import { CompetitionDto } from '../shared/classes/CompetitionDto';
import { ActivatedRoute } from '@angular/router';
import { HalterodataPocService } from '../shared/services/halterodata-poc.service';

@Component({
  selector: 'app-halterodata-poc-competition',
  standalone: false,
  templateUrl: './halterodata-poc-competition.component.html',
  styleUrl: './halterodata-poc-competition.component.css',
})
export class HalterodataPocCompetitionComponent implements OnInit {
  competitionId: any;
  competition?: CompetitionDto;

  Math = Math; // expose Math to template for expressions

  loading = false;
  searchTerm = '';
  filters: any = { licence: '', nom: '', an: '', club: '', nation: '' };

  // pagination
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  totalPages = 1;

  // data
  allEntries: any[] = [];
  entries: any[] = [];

  constructor(private route: ActivatedRoute,
    private halterodataPocService: HalterodataPocService) {}

  ngOnInit(): void {
    this.competitionId = this.route.snapshot.paramMap.get('id');
    this.getCompetition();
  }

  getCompetition(): void {
    this.halterodataPocService.getCompetitionById(this.competitionId).subscribe(
      (data) => {
        this.competition = data;
        console.log('Competition data:', data);
        // when competition is loaded, use its details to populate entries
        this.populateFromDetails();
        this.loadEntries();
      },
      (err) => {
        console.error('Error fetching competition data:', err);
      },
    );
  }

  populateFromDetails() {
    const details = this.competition?.details || [];
    this.allEntries = details.map((d) => {
      const athlete = (d as any).athlete;
      let licence = '';
      let name = '';
      let year: number | null = null;
      let club = d.club || '';

      if (athlete) {
        licence = athlete.licenceId ? '' + athlete.licenceId : '';
        name = athlete.fullName || '';
        if (athlete.birthDate) {
          try {
            const dt = new Date(athlete.birthDate);
            if (!isNaN(dt.getTime())) year = dt.getFullYear();
          } catch (e) {
            year = null;
          }
        }
        if (!club && athlete.currentClub) club = athlete.currentClub;
      }

      return {
        athleteId: athlete?.id ?? null,
        licence: licence,
        name: name,
        year: year || null,
        club: club || '',
        nation: d.countryCode || athlete?.countryCode || '',
        bodyWeight: d.bodyWeight ?? null,
        snatch1: d.snatch1 ?? null,
        snatch2: d.snatch2 ?? null,
        snatch3: d.snatch3 ?? null,
        cj1: d.cj1 ?? null,
        cj2: d.cj2 ?? null,
        cj3: d.cj3 ?? null,
        category: d.category || '',
        total: d.total ?? null,
      };
    });

    this.totalItems = this.allEntries.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  loadEntries(page?: number) {
    if (page) this.currentPage = page;
    this.loading = true;

    // simulate async load
    setTimeout(() => {
      let list = [...this.allEntries];

      // apply searchTerm across name, club, licence
      const s = (this.searchTerm || '').trim().toLowerCase();
      if (s) {
        list = list.filter((e) =>
          (e.name + ' ' + e.club + ' ' + e.licence).toLowerCase().includes(s)
        );
      }

      // apply column filters
      if (this.filters.licence) {
        list = list.filter((e) => ('' + e.licence).includes(this.filters.licence));
      }
      if (this.filters.nom) {
        list = list.filter((e) => e.name.toLowerCase().includes(this.filters.nom.toLowerCase()));
      }
      if (this.filters.an) {
        list = list.filter((e) => ('' + e.year).includes(this.filters.an));
      }
      if (this.filters.club) {
        list = list.filter((e) => e.club.toLowerCase().includes(this.filters.club.toLowerCase()));
      }
      if (this.filters.nation) {
        list = list.filter((e) => (e.nation || '').toLowerCase().includes(this.filters.nation.toLowerCase()));
      }

      this.totalItems = list.length;
      this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));

      // clamp currentPage
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
      if (this.currentPage < 1) this.currentPage = 1;

      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.entries = list.slice(start, end);

      this.loading = false;
    }, 200);
  }

  onPageSizeChange(size: number) {
    this.pageSize = +size;
    this.currentPage = 1;
    this.loadEntries();
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadEntries();
  }

  clearSearch() {
    this.searchTerm = '';
    this.filters = { licence: '', nom: '', an: '', club: '', nation: '' };
    this.loadEntries();
  }

  exportPdf() {
    console.log('Export PDF (fake)');
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadEntries();
  }

  trackById(index: number, item: any) {
    return item.athleteId ?? item.licence ?? index;
  }
}
