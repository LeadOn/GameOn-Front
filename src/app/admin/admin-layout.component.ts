import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { environment } from '../../environments/environment';
import {
  faBars,
  faCalendarDays,
  faChevronUp,
  faClock,
  faComputer,
  faGamepad,
  faHome,
  faImage,
  faRightFromBracket,
  faSoccerBall,
  faTrophy,
  faUsers,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { animate, style, transition, trigger } from '@angular/animations';
import Keycloak from 'keycloak-js';

interface AdminNavItem {
  label: string;
  route: string;
  icon: IconDefinition;
}

interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(200, style({ opacity: 0 })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AdminLayoutComponent {
  private readonly keycloak = inject(Keycloak);

  menuIcon = faBars;
  logoutIcon = faRightFromBracket;
  chevronIcon = faChevronUp;

  navGroups: AdminNavGroup[] = [
    {
      label: 'Pilotage',
      items: [{ label: "Vue d'ensemble", route: '/admin', icon: faHome }],
    },
    {
      label: 'Gestion',
      items: [
        { label: 'FIFA', route: '/admin/fifa', icon: faSoccerBall },
        { label: 'Joueurs', route: '/admin/general/players', icon: faUsers },
        {
          label: 'Saisons',
          route: '/admin/general/seasons',
          icon: faCalendarDays,
        },
        {
          label: 'Plateformes',
          route: '/admin/general/platforms',
          icon: faComputer,
        },
      ],
    },
    {
      label: 'Système',
      items: [{ label: 'Changelog', route: '/admin/changelog', icon: faClock }],
    },
  ];

  sidebarOpen = signal<boolean>(false);
  userMenuOpen = signal<boolean>(false);

  get userName(): string {
    const tokenParsed = this.keycloak.tokenParsed;
    return (
      tokenParsed?.['name'] ?? tokenParsed?.['preferred_username'] ?? 'Admin'
    );
  }

  get userInitials(): string {
    return this.userName
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  toggleSidebar() {
    this.sidebarOpen.update((prev) => !prev);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  toggleUserMenu() {
    this.userMenuOpen.update((prev) => !prev);
  }

  logout() {
    window.location.replace(
      environment.keycloak.url +
        '/realms/gameon/protocol/openid-connect/logout',
    );
  }
}
