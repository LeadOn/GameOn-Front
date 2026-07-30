/**
 * Backend-computed per-team objective tally for a match (`GET lol/Match/{matchId}`,
 * `leagueOfLegendsGameTeams`), replacing the client-side timeline scan for
 * everything except Atakhan (absent from Riot's `teams[].objectives` payload,
 * still derived from the timeline — see `atakhanKillsForTeam`). Empty array on
 * games not yet (re)synced with this field populated.
 */
export class LoLGameTeam {
  teamId: number = 0;
  win: boolean = false;
  championKills: number = 0;
  towerKills: number = 0;
  inhibitorKills: number = 0;
  dragonKills: number = 0;
  riftHeraldKills: number = 0;
  baronKills: number = 0;
  hordeKills: number = 0;
  firstBlood: boolean = false;
  firstTower: boolean = false;
  firstInhibitor: boolean = false;
  firstDragon: boolean = false;
  firstBaron: boolean = false;
  firstRiftHerald: boolean = false;
  firstHorde: boolean = false;
}
