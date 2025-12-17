import { HttpStatus } from "@nestjs/common";

export interface ApiResponse<T = any> {
  status: "success" | "error";
  message: string;
  data?: T;
  error?: any;
  meta?: {
    page?: number;
    pageSize?: number;
    totalItems?: number;
    totalPages?: number;
  };
}

export const createSuccessResponse = <T>(
  data: T,
  message = "Operation successful",
  meta?: ApiResponse["meta"],
): ApiResponse<T> => ({
  status: "success",
  message,
  data,
  ...(meta && { meta }),
});

export const createErrorResponse = (
  message: string,
  error?: any,
): ApiResponse => ({
  status: "error",
  message,
  ...(error && { error }),
});

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
}

export const DEFAULT_PAGE_SIZE = 10;

export const buildPaginationQuery = (query: any, params: PaginationParams) => {
  const {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    orderBy,
    orderDir = "desc",
  } = params;

  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  query = query.range(start, end);

  if (orderBy) {
    query = query.order(orderBy, { ascending: orderDir === "asc" });
  }

  return query;
};
