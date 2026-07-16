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

## Testing UI changes

Any change to the UI (a component's `.html`/`.ts`/styles, layout, or anything visually or behaviorally user-facing) must be verified in a real browser using the Playwright MCP tools before being reported as done. Start the dev server (`npm start`), navigate to the affected page(s) with `mcp__playwright__browser_navigate`, and exercise the golden path plus relevant edge cases (interactions, responsive behavior, loading/error states) using the other `mcp__playwright__*` tools (`browser_click`, `browser_snapshot`, `browser_take_screenshot`, etc.). Passing type-checks or unit tests is not a substitute for this — it verifies correctness, not that the UI actually renders and behaves as intended.

## Architecture

### NgModules, not standalone, despite Angular 22

`angular.json` explicitly sets `standalone: false` as the default for generated components/directives/pipes. This is an intentional, NgModule-based codebase (`AppModule`, `SharedModule`, feature modules) — don't generate standalone components by default; follow the existing module-declaration pattern.

### Module layout

- `src/app/routes/` — public-facing feature areas: `home`, `fifa`, `lol`, `profile`, `changelog`. `fifa` and `lol` are lazy-loaded (`loadChildren`) via their own `*-routing.module.ts` + `*.module.ts`, each with a `components/` subfolder for area-local components.
- `src/app/routes/home/` — the landing page, assembled from small focused components in `components/`: `header`, `tournament-banner`, `fifa-stats`, `matches-list`, `news-panel`, `lol-leaderboard`, `lol-season-card`. All declared directly in `app.module.ts` (the home route is not lazy-loaded, unlike `fifa`/`lol`). Everything on it is backed by real data except the tournament banner's background image (a generic reused asset — `Tournament` has no photo field) and its "Classement" button (no dedicated ranking view exists yet, so it links to the same tournament page as "Voir le tournoi").
- `src/app/admin/` — the admin portal, also lazy-loaded under `/admin`. Mirrors backend domains: `fifa/{games,highlights,tournaments}`, `general/{platforms,players,seasons}`, `changelog`. Has its own layout (`admin-layout.component`) and its own guard requirement (role `gameon_admin`).
- `src/app/shared/` — cross-cutting: `layouts/` (`CommonLayoutComponent` for public pages vs `AdminLayoutComponent`), `components/`, `services/{common,fifa,leagueoflegends}/`, `classes/{common,fifa,lol}/` (plain TS DTO/model classes mirroring backend payloads), `modules/shared.module.ts` (declares/exports the shared components, pipes, and Angular form/router modules used app-wide).
- `src/app/core/` — `guards/auth.guard.ts`, `pipes/safe.pipe.ts`, and the NgRx `store/{actions,reducers}`.

### Auth & API calls

- Keycloak integration via `keycloak-angular` (`provideKeycloak` in `app.module.ts`). Role-gated routes use `canActivate: [canActivateAuthRole]` with `data: { role: '...' }` (see `app-routing.module.ts` and `admin-routing.module.ts`); `auth.guard.ts` checks `authData.grantedRoles.realmRoles` for that role string.
- Bearer tokens are attached via `includeBearerTokenInterceptor`, gated by URL-pattern conditions (`devCondition` for `localhost:5184`, `prodCondition` for `gameon-api.valentinvirot.fr`) defined in `app.module.ts`. **If the API base URL changes or a new environment is added, these regex conditions must be updated too**, or the bearer token won't be attached.
- Services are grouped by domain under `shared/services/{common,fifa,leagueoflegends}`, named `GameOn<Domain>Service` (e.g. `GameOnPlayerService`), `providedIn: 'root'`, and call `environment.gameOnApiUrl + '/path'` directly with `HttpClient` — there's no shared API-client abstraction or central HTTP error handling. Error handling in components is ad hoc (`subscribe(success, err => { alert(...); console.error(err) })`), not via interceptors or a notification service.
- `RiotLoLService` is the one exception: it calls Riot's public `ddragon` CDN directly (not the GameOn API) to fetch LoL patch versions.

### State management is partial, not the default

NgRx (`StoreModule.forRoot`) is wired up in `app.module.ts` with four reducers: `player`, `globalStats` (`playerStatsReducer`), `lolVersion`, `lolQueues`. Most components do **not** go through the store — they inject services directly and `.subscribe()` in `ngOnInit`/handlers. Only use the store for state that's already modeled there (current player, global stats, LoL version, LoL queue catalog); don't assume every piece of state is store-backed. `lolVersion` is populated once at app bootstrap (`app.component.ts`'s `ngOnInit`, via `RiotLoLService`), while `lolQueues` is populated once when the lazy `LolModule` is first instantiated (its constructor calls `GameOnLoLService.getQueues()` and dispatches `setLoLQueues`) — `lolQueues` is LoL-specific and never needed outside `/lol/**`, so it's loaded lazily with that feature module instead of eagerly at the root.

### Environments

`src/environments/environment.ts` (dev) and `environment.prod.ts` are swapped via `fileReplacements` in the `production` build configuration (`angular.json`). Each defines `gameOnApiUrl` and the Keycloak `{ url, realm, clientId }`.

### Styling

Tailwind CSS v4 + Flowbite plugin (`tailwind.config.js` scans `src/**/*.{html,ts}` and `node_modules/flowbite`). Prettier is configured with `prettier-plugin-tailwindcss` to sort utility classes — run Prettier rather than hand-ordering classes.

Page-level content is wrapped in `mx-auto w-full max-w-6xl px-4` (see `lol-home.component.html`, `lol-player-details.component.html`, `home.component.html`) so pages stay centered and capped in width on wide screens instead of stretching edge to edge — follow this pattern for any new top-level route component.

Custom Angular component tags default to `display: inline` in this codebase (no `:host { display: block }` anywhere). A `space-y-*`/margin utility applied directly to a custom element tag as a flex/grid child silently has no visual effect. Wrap component tags in a plain `<div>` or `<section>` if they need to participate in `space-y-*` spacing.

### Locale

`app.module.ts` registers French locale data (`registerLocaleData(localeFr)` from `@angular/common/locales/fr`) and provides `{ provide: LOCALE_ID, useValue: 'fr' }`, so `DatePipe` and other locale-aware pipes format dates in French app-wide.

### LoL tier/rank logic

`src/app/shared/classes/lol/lol-tier.util.ts` is the single source of truth for League of Legends tier logic: rank ordering/scoring for sorting (`tierRankScore`), win rate (`tierWinRate`), display label (`tierLabel`, e.g. "Platinum I"), rank emblem image URL (`tierEmblemUrl`, falls back to the GameOn logo when unranked), and tier glow color (`tierGlowShadow`/`tierGlowBackground`, used as a `drop-shadow`/background glow keyed by tier). Used by `lol-home.component.ts`, `lol-player-details.component.ts`, and the home page's `lol-leaderboard`/`lol-season-card` — put any new tier-related logic here rather than reimplementing it locally.

### LoL queue catalog

`GameOnLoLService.getQueues()` fetches the full GameOn queue catalog (`GET /lol/queue` — `{ id, map, description, notes }` per queue) and is cached in the NgRx `lolQueues` store slice (populated once by `LolModule`'s constructor, see above). `src/app/shared/classes/lol/lol-queue.util.ts`'s `queueLabel(queues, queueId, fallback)` is the single source of truth for turning a `LoLGame.queueId` into a display string — it falls back to an empty string (or an explicit `fallback` argument) when the id isn't in the catalog or the game predates `queueId` being populated by the backend. Used by `lol-game-card.component.ts` and `lol-game-details.component.ts`; put any new queue-label logic here. `LoLGame` no longer has a `queueType` field — it's been decommissioned in favor of `queueId`, don't reintroduce string-based queue matching.

Separately, `GameOnLoLService.getQueuesForPlayer(playerId)` (`GET /lol/queue/player/{id}`) returns only the queues a given player has actually played, used to populate the multi-select queue filter on the player profile page (`lol-player-details.component.ts`) without offering queues they've never touched. This is a per-player fetch, not stored in NgRx (it's scoped to whichever profile is open, unlike the global catalog). Selecting queues in that filter feeds `GameOnLoLService.getLastGamesPlayedByPlayer`'s `queueIds` param, sent as `queues=<id1>,<id2>` on `GET /lol/match/player/{id}` (the param is omitted entirely when no queue is selected, meaning "all queues").
