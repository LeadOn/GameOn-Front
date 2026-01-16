import { CompetitionDto } from "./CompetitionDto";

export class CompetitionSearchResultDto {
  page: number = 1;
  resultsPerPage: number = 1;
  total: number = 1;
  results: CompetitionDto[] = [];
}
