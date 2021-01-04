
/*This name should be exactly same as what you get from response header from server.*/
export interface Pagination {
  currentPage: number;
  itemPerPage: number;
  totalItems: number;
  totalPages: number;
}

//T here will represent array of members
export class PaginatedResult<T>{
  result: T;
  pagination: Pagination;
}
