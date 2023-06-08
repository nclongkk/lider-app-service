export interface PaginationParam {
  page: number;
  limit: number;
  allRecords?: boolean;
}

export interface Metadata {
  page: number;
  totalPage: number;
  limit: number;
  total: number;
}

export interface PaginationResult<T> {
  paging: {
    total: number;
    page: number;
    limit: number;
  };
  content: T[];
}
