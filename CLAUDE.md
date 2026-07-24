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

### LoL match participant challenge stats (Riot-computed)

`LoLGameParticipant` (`src/app/shared/classes/lol/LoLGameParticipant.ts`) carries three raw Riot-inferred fields alongside the base kill/death/item data: `teamPosition`/`individualPosition` (role strings — `teamPosition` is Riot's reliable inferred role, `individualPosition` a less reliable heuristic; both empty string on roleless modes like ARAM) and `visionScore` (Riot's own computed score, not a raw ward count). It also carries `challenges?: LoLGameParticipantChallenges` — Riot's ~120-field derived stats block (KDA, kill participation, damage/gold per minute, objective/vision breakdowns, ...). All of this is only populated once a match has been (re)synced via `POST /lol/match/{matchId}/update` (or the backend's Python backfill script); games not yet re-synced have `challenges == null` and empty/zeroed role fields, so every consumer must null-guard rather than assume presence.

`src/app/shared/classes/lol/LoLGameParticipantChallenges.ts` mirrors the backend's `LoLGameParticipantChallenge` domain entity **field-for-field** (camelCase, same order) — it was generated by fetching a real `GET /lol/Match/{matchId}` payload and cross-checking field names against the entity in `GameOn-API`, not guessed from Riot's public docs. If the backend entity gains/renames fields, regenerate the same way rather than hand-editing — a wrong field name silently receives `undefined` at runtime since `HttpClient.get<T>()` does a plain cast, no runtime key mapping.

`src/app/shared/classes/lol/lol-role.util.ts` is the single source of truth for turning `teamPosition` into a display label (`roleLabel`, French) or an icon URL (`roleIconUrl`, served from Community Dragon's CDN — `raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/.../position-<role>.svg`); both return an empty string / `undefined` for roleless modes. Used by `lol-game-details-player.component.ts` (small badge over the champion portrait) and `lol-game-raw-stats-table.component.ts` (table header).

`src/app/shared/classes/lol/lol-challenge-fields.util.ts` exports `CHALLENGE_FIELD_KEYS` (every `LoLGameParticipantChallenges` key except the internal `loLGameParticipantId` FK, in entity order) and `challengeFieldLabel(key)` (French label lookup, `CHALLENGE_FIELD_LABELS` — falls back to a camelCase-humanizer only if a field is missing from that table). Put any new challenge field's translation there rather than inlining it elsewhere.

Two places surface these challenges, both under `src/app/routes/lol/`:
- `components/lol-game-details-player/` — the per-row scoreboard entry. Shows the role badge next to the champion icon, and inside the existing expandable "Statistiques avancées" panel, a curated 9-stat "Riot challenges" grid (KDA, KP, damage/gold per min, vision/min, solo kills, ward takedowns, skillshots) plus a secondary "Voir plus de statistiques" toggle revealing ~30 more stats grouped into categories (Faits marquants, Combat, Objectifs, Tourelles & plaques, Farm & laning, Jungle, Vision, Survie & soutien). All challenge-derived getters are named `challenge*` and null-guard with `?? 0`/ternaries since `player.challenges` can be `undefined`.
- `components/lol-game-raw-stats-table/` — a full raw dump: one row per `CHALLENGE_FIELD_KEYS` entry (French label via `challengeFieldLabel`), one column per player (champion icon + role badge + name, colored by `teamId` 100/200 = blue/red), collapsed by default. Mounted at the very bottom of `games/details/lol-game-details.component.html`, fed by that component's existing `allPlayers`/`gamePatch`. Values are formatted raw (French thousands/decimal separators, `—` for missing) rather than reinterpreted — it's the escape hatch for stats the curated views don't surface.
