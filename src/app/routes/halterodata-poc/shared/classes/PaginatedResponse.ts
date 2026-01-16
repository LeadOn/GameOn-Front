export class PaginatedResponse<T> {
  data: T[] = [];
  total: number = 0;
  page: number = 0;
  pageSize: number = 0;
  totalPages: number = 0;
}
