import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CompetitionDto } from '../../classes/CompetitionDto';

@Component({
  selector: 'app-competitions-table',
  standalone: false,
  templateUrl: './competitions-table.component.html',
  styleUrl: './competitions-table.component.css',
})
export class CompetitionsTableComponent {
  @Input() competitions: CompetitionDto[] = [];
  @Input() loading: boolean = false;
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 20;
  @Input() totalItems: number = 0;
  @Input() totalPages: number = 0;
  @Input() sortField: string = 'date';
  @Input() sortOrder: 'asc' | 'desc' = 'desc';

  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<string>();

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

  sortBy(field: string): void {
    this.sortChange.emit(field);
  }

  changePage(page: number): void {
    if (page <= 0 || page > this.totalPages) return;
    this.pageChange.emit(page);
  }

  getVisiblePages(): (number | 'ellipsis')[] {
    const pages: (number | 'ellipsis')[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    pages.push(1);

    if (current <= 3) {
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push('ellipsis');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
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
