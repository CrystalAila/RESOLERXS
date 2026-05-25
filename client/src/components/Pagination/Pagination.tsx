import type { FC } from "react";

interface PaginationProps {
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  total?: number;
  perPage?: number;
  alwaysShow?: boolean;
}

const Pagination: FC<PaginationProps> = ({
  page,
  lastPage,
  onPageChange,
  loading = false,
  total = 0,
  perPage = 15,
  alwaysShow = false,
}) => {
  if (!alwaysShow && lastPage <= 1 && total === 0) return null;

  const safeLastPage = Math.max(lastPage, 1);
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = total === 0 ? 0 : Math.min(page * perPage, total);

  return (
    <div
      className={`relative z-10 flex shrink-0 items-center justify-between gap-4 border-t border-rx-border bg-rx-card px-4 py-3 ${loading ? "opacity-70" : ""}`}
    >
      <p className="text-xs text-rx-muted">
        {total > 0 ? (
          <>
            Showing {from}–{to} of {total} · Page {page} of {safeLastPage}
          </>
        ) : (
          <>Page {page} of {safeLastPage}</>
        )}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-rx-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-rx-muted transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= safeLastPage}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-rx-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-rx-muted transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
