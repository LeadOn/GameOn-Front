export class ListResultDto<T> {
  page: number = 0;
  resultsPerPage: number = 0;
  total: number = 0;
  results: T[] = [];
}
