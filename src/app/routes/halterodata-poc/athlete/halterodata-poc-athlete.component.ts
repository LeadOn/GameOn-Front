import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HalterodataPocService } from '../shared/services/halterodata-poc.service';
import { AthleteDto } from '../shared/classes/AthleteDto';
import { CompetitionDto } from '../shared/classes/CompetitionDto';

@Component({
  selector: 'app-halterodata-poc-athlete',
  standalone: false,
  templateUrl: './halterodata-poc-athlete.component.html',
  styleUrl: './halterodata-poc-athlete.component.css',
})
export class HalterodataPocAthleteComponent implements OnInit {
  athleteId: any;
  athlete?: AthleteDto;

  // Compétitions
  competitions: CompetitionDto[] = [];
  loading: boolean = false;
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 20;
  totalItems: number = 0;
  totalPages: number = 0;

  // Tri
  sortField: string = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(
    private route: ActivatedRoute,
    private halterodataPocService: HalterodataPocService,
  ) {}

  ngOnInit(): void {
    this.athleteId = this.route.snapshot.paramMap.get('id');
    this.getAthlete();
    this.loadCompetitions();
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

  loadCompetitions(): void {
    this.loading = true;

    this.halterodataPocService
      .getCompetitionsByAthleteId(
        this.athleteId,
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
          this.loading = false;
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
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.sortCompetitions();
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
}
