# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

### NgModules, not standalone, despite Angular 21

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
