import { PaginatedStatus, PaginationData, PaginationQuery } from '@app/v1/dto/Status';

export class Pagination {
  public static paginated<D>(data: D, query: PaginationQuery, count: number): PaginatedStatus<D> {
    return {
      success: true,
      data,
      error: undefined,
      pagination: this.createPagination(query, count),
    };
  }

  public static createPaginationQuery(page = 1, take = 20): PaginationQuery {
    if (page < 1) page = 1;

    // Ensure rounded numbers
    page = Math.floor(page);

    return {
      take,
      skip: (page - 1) * take,
    };
  }

  public static createPagination(query: PaginationQuery, count: number): PaginationData {
    return {
      current: query.skip / query.take + 1,
      total: Math.ceil(count / query.take),
      max: query.take,
    };
  }
}
