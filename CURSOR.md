# CURSOR.md

This file provides guidance to Cursor when working with code in this repository. It mirrors `CLAUDE.md` at the repo root — keep both in sync when either changes.

> Note: Cursor's own auto-loaded convention is `.cursor/rules/*.mdc` (or the legacy `.cursorrules`), not `CURSOR.md`. This file is kept under that name on request; if you want it picked up automatically by Cursor without manually attaching it, mirror it into `.cursor/rules/` as well.

## Project

GameOn! is an Angular front-end for tracking cross-game (and IRL) player performance/stats. It talks to the GameOn! API (`gameOnApiUrl` in environment files, Swagger docs at `gameon-api.valentinvirot.fr/swagger`) and to Keycloak for auth. Production runs at `gameon.valentinvirot.fr`.

## Commands

- `npm ci` — install dependencies (use this, not `npm install`, to match `package-lock.json`).
- `npm start` / `ng serve` — run locally (dev server, port 4200 by default).
- `npm run build` / `ng build` — production build, output to `dist/gameon-front`.
- `npm run watch` — incremental dev build (`--configuration development`).
- `npm test` / `ng test` — run Karma/Jasmine unit tests. No `.spec.ts` files exist yet in `src/`; when adding tests, `tsconfig.spec.json` is already wired up.
- Node version is pinned via `.nvmrc` (v23.6.1).
- Docker: `Dockerfile` builds with `npm ci --legacy-peer-deps` (required — plain `npm ci` may fail on peer deps) then serves `dist/gameon-front/browser` via nginx (`nginx.conf`, port 80).

## Architecture

### NgModules, not standalone, despite Angular 22

`angular.json` explicitly sets `standalone: false` as the default for generated components/directives/pipes. This is an intentional, NgModule-based codebase (`AppModule`, `SharedModule`, feature modules) — don't generate standalone components by default; follow the existing module-declaration pattern.

### Module layout

- `src/app/routes/` — public-facing feature areas: `home`, `fifa`, `lol`, `profile`, `changelog`. `fifa` and `lol` are lazy-loaded (`loadChildren`) via their own `*-routing.module.ts` + `*.module.ts`, each with a `components/` subfolder for area-local components.
- `src/app/admin/` — the admin portal, also lazy-loaded under `/admin`. Mirrors backend domains: `fifa/{games,highlights,tournaments}`, `general/{platforms,players,seasons}`, `changelog`. Has its own layout (`admin-layout.component`) and its own guard requirement (role `gameon_admin`).
- `src/app/shared/` — cross-cutting: `layouts/` (`CommonLayoutComponent` for public pages vs `AdminLayoutComponent`), `components/`, `services/{common,fifa,leagueoflegends}/`, `classes/{common,fifa,lol}/` (plain TS DTO/model classes mirroring backend payloads), `modules/shared.module.ts` (declares/exports the shared components, pipes, and Angular form/router modules used app-wide).
- `src/app/core/` — `guards/auth.guard.ts`, `pipes/safe.pipe.ts`, and the NgRx `store/{actions,reducers}`.

### Auth & API calls

- Keycloak integration via `keycloak-angular` (`provideKeycloak` in `app.module.ts`). Role-gated routes use `canActivate: [canActivateAuthRole]` with `data: { role: '...' }` (see `app-routing.module.ts` and `admin-routing.module.ts`); `auth.guard.ts` checks `authData.grantedRoles.realmRoles` for that role string.
- Bearer tokens are attached via `includeBearerTokenInterceptor`, gated by URL-pattern conditions (`devCondition` for `localhost:5184`, `prodCondition` for `gameon-api.valentinvirot.fr`) defined in `app.module.ts`. **If the API base URL changes or a new environment is added, these regex conditions must be updated too**, or the bearer token won't be attached.
- Services are grouped by domain under `shared/services/{common,fifa,leagueoflegends}`, named `GameOn<Domain>Service` (e.g. `GameOnPlayerService`), `providedIn: 'root'`, and call `environment.gameOnApiUrl + '/path'` directly with `HttpClient` — there's no shared API-client abstraction or central HTTP error handling. Error handling in components is ad hoc (`subscribe(success, err => { alert(...); console.error(err) })`), not via interceptors or a notification service.
- `RiotLoLService` is the one exception: it calls Riot's public `ddragon` CDN directly (not the GameOn API) to fetch LoL patch versions.

### State management is partial, not the default

NgRx (`StoreModule.forRoot`) is wired up in `app.module.ts` with exactly three reducers: `player`, `globalStats` (`playerStatsReducer`), `lolVersion`. Most components do **not** go through the store — they inject services directly and `.subscribe()` in `ngOnInit`/handlers. Only use the store for state that's already modeled there (current player, global stats, LoL version); don't assume every piece of state is store-backed.

### Environments

`src/environments/environment.ts` (dev) and `environment.prod.ts` are swapped via `fileReplacements` in the `production` build configuration (`angular.json`). Each defines `gameOnApiUrl` and the Keycloak `{ url, realm, clientId }`.

### Styling

Tailwind CSS v4 + Flowbite plugin (`tailwind.config.js` scans `src/**/*.{html,ts}` and `node_modules/flowbite`). Prettier is configured with `prettier-plugin-tailwindcss` to sort utility classes — run Prettier rather than hand-ordering classes.

Page-level content is wrapped in `mx-auto w-full max-w-6xl px-4` (see `lol-home.component.html`, `lol-player-details.component.html`, `home.component.html`) so pages stay centered and capped in width on wide screens instead of stretching edge to edge — follow this pattern for any new top-level route component.

Custom Angular component tags default to `display: inline` in this codebase (no `:host { display: block }` anywhere). A `space-y-*`/margin utility applied directly to a custom element tag as a flex/grid child silently has no visual effect. Wrap component tags in a plain `<div>` or `<section>` if they need to participate in `space-y-*` spacing.

### Locale

`app.module.ts` registers French locale data (`registerLocaleData(localeFr)` from `@angular/common/locales/fr`) and provides `{ provide: LOCALE_ID, useValue: 'fr' }`, so `DatePipe` and other locale-aware pipes format dates in French app-wide.

## In-progress: home page rework

The public home page (`src/app/routes/home/`) is being reworked in 3 phases: (1) layout + placeholders, (2) rework each component's visuals/data once phase 1 is validated, (3) build any genuinely new components the redesign needs. Phase 1 is done; phases 2 and 3 have not started.

What phase 1 changed: the old 3-component structure (`home-fifa`, `home-lol`, `home-changelog`) was replaced by 7 focused components under `routes/home/components/`: `header`, `tournament-banner`, `fifa-stats`, `matches-list`, `news-panel`, `lol-leaderboard`, `lol-season-card`, each declared directly in `app.module.ts` (the home route isn't lazy-loaded).

Data status per component, for whoever picks up phase 2:
- **Real data**: `header` (player from the NgRx `player` store, season from `HomeDataDto`), `tournament-banner` (tournament name/link/player count from `HomeDataDto.featuredTournaments[0]`), `fifa-stats`'s "Ma saison" and "Buts" cards (real `PlatformStatsDto` via `GameOnPlayerService.getStats`), `matches-list` (real planned + last games via `GameOnGameService`), `news-panel` (real changelog, same as the old `home-changelog`).
- **Static placeholder, no backing data yet**: `fifa-stats`'s "Forme récente" card (no win/loss streak concept anywhere in the API — would need computing from a player's recent games), `lol-leaderboard` (no LoL leaderboard endpoint exists on `GameOnLolService`), `lol-season-card` (not confirmed whether a per-player current-rank endpoint already exists elsewhere, e.g. the LoL profile page — check there first), the tournament banner's subtitle text and background image (the `Tournament` model has no "phase"/"next match" fields).
