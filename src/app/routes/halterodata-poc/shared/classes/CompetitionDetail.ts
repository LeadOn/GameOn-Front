import { AthleteDto } from "./AthleteDto";

export class CompetitionDetail {
  club: string | null = null;
  countryCode: string | null = null;
  bodyWeight: number | null = null;
  snatch1: number | null = null;
  snatch2: number | null = null;
  snatch3: number | null = null;
  bestSnatch: number | null = null;
  cj1: number | null = null;
  cj2: number | null = null;
  cj3: number | null = null;
  bestCj: number | null = null;
  total: number | null = null;
  serie: string | null = null;
  category: string | null = null;
  iwf: number | null = null;
  athlete?: AthleteDto
}
