/** Laravel paginated resource shape (data + meta). */
export interface PaginatedPayload<T> {
  data?: T[];
  meta?: {
    current_page?: number;
    last_page?: number;
    total?: number;
    per_page?: number;
  };
}

export function parsePaginatedResponse<T>(payload: PaginatedPayload<T> | null | undefined) {
  const data = payload?.data ?? [];
  const meta = payload?.meta;
  const perPage = meta?.per_page ?? 15;
  const total = meta?.total ?? data.length;
  const currentPage = meta?.current_page ?? 1;
  const lastPage =
    meta?.last_page ?? (total > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1);

  return {
    data,
    currentPage,
    lastPage,
    total,
    perPage,
  };
}
