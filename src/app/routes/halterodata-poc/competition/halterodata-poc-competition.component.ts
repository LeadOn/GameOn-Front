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

  // pagination
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  totalPages = 1;

  // data
  displayedDetails: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private halterodataPocService: HalterodataPocService,
  ) {}

  ngOnInit(): void {
    this.competitionId = this.route.snapshot.paramMap.get('id');
    this.getCompetition();
  }

  getCompetition(): void {
    this.halterodataPocService.getCompetitionById(this.competitionId).subscribe(
      (data) => {
        this.competition = data;
        console.log('Competition data:', data);
        // initialize pagination based on competition.details
        this.totalItems = (this.competition?.details || []).length;
        this.totalPages = Math.max(
          1,
          Math.ceil(this.totalItems / this.pageSize),
        );
        this.loadEntries();
      },
      (err) => {
        console.error('Error fetching competition data:', err);
      },
    );
  }

  // helper getters for details
  getAthleteName(d: any) {
    return d?.athlete?.fullName || '';
  }

  getLicence(d: any) {
    return d?.athlete?.licenceId ? '' + d.athlete.licenceId : '';
  }

  getYear(d: any): number | null {
    const bd = d?.athlete?.birthDate;
    if (!bd) return null;
    try {
      const dt = new Date(bd);
      if (!isNaN(dt.getTime())) return dt.getFullYear();
    } catch (e) {}
    return null;
  }

  loadEntries(page?: number) {
    if (page) this.currentPage = page;
    this.loading = true;

    // simulate async load
    setTimeout(() => {
      let list = [...(this.competition?.details || [])];

      // apply searchTerm across athlete fullName, club, licence
      const s = (this.searchTerm || '').trim().toLowerCase();
      if (s) {
        list = list.filter((d) =>
          (
            this.getAthleteName(d) +
            ' ' +
            (d.club || '') +
            ' ' +
            this.getLicence(d)
          )
            .toLowerCase()
            .includes(s),
        );
      }

      this.totalItems = list.length;
      this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));

      // clamp currentPage
      if (this.currentPage > this.totalPages)
        this.currentPage = this.totalPages;
      if (this.currentPage < 1) this.currentPage = 1;

      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.displayedDetails = list.slice(start, end);

      this.loading = false;
    }, 200);
  }

  onPageSizeChange(size: number) {
    this.pageSize = +size;
    this.currentPage = 1;
    this.loadEntries();
  }

  clearSearch() {
    this.searchTerm = '';
    this.loadEntries();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadEntries();
  }

  trackById(index: number, item: any) {
    return item?.athlete?.id ?? item?.athlete?.licenceId ?? index;
  }
}
