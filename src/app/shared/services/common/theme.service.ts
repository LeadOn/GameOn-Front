import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'gameon-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  );

  theme$ = this.themeSubject.asObservable();

  get theme(): Theme {
    return this.themeSubject.value;
  }

  toggle(): void {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY, theme);
    this.themeSubject.next(theme);
  }
}
