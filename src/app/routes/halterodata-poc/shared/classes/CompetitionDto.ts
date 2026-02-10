import { CompetitionDetail } from "./CompetitionDetail";

export class CompetitionDto {
  id: number = 0;
  scoresheetId: number = 0;
  seasonId: number = 0;
  name: string = '';
  gender: number = 0;
  league: string = '';
  type: boolean = false;
  date: Date = new Date();
  state: number = 0;
  details?: CompetitionDetail[];
}
