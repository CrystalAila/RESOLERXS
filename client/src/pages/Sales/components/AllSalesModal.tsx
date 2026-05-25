import { useEffect, useState, type FC } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import Modal from "../../../components/Modal";
import Pagination from "../../../components/Pagination/Pagination";
import { Spinner } from "../../../components/Spinner/Spinner";
import type { SaleColumns } from "../../../Interfaces/SaleInterface";
import SaleService from "../../../services/SaleService";
import { formatCurrency, formatDate } from "../../../utils/format";
import { parsePaginatedResponse } from "../../../utils/pagination";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AllSalesModal: FC<Props> = ({ isOpen, onClose }) => {
  const [sales, setSales] = useState<SaleColumns[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setPage(1);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoading(true);
    SaleService.loadSales(page)
      .then((res) => {
        if (cancelled) return;
        const { data, currentPage, lastPage: lp } = parsePaginatedResponse<SaleColumns>(res.data.sales);
        setSales(data);
        setPage(currentPage);
        setLastPage(lp);
      })
      .catch(() => {
        if (!cancelled) {
          setSales([]);
          setLastPage(1);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, page]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl" showCloseButton={false}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">All Sales</h2>
        <CloseButton onClose={onClose} />
      </div>
      {loading && sales.length === 0 ? (
        <div className="flex justify-center py-12">
          <Spinner size="md" />
        </div>
      ) : sales.length === 0 ? (
        <p className="py-8 text-center text-sm text-rx-muted">No sales recorded yet.</p>
      ) : (
        <>
          <ul className={`max-h-96 space-y-3 overflow-y-auto ${loading ? "opacity-60" : ""}`}>
            {sales.map((sale) => (
              <li
                key={sale.sale_id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-rx-border pb-3 last:border-0"
              >
                <div>
                  <p className="font-semibold">{formatCurrency(Number(sale.total_amount))}</p>
                  <p className="text-xs text-rx-muted">
                    {formatDate(sale.sale_date)} · {sale.user?.name}
                    {sale.items?.length ? ` · ${sale.items.length} item(s)` : ""}
                  </p>
                </div>
                <span className="text-sm font-medium text-emerald-400">
                  +{formatCurrency(Number(sale.total_profit))}
                </span>
              </li>
            ))}
          </ul>
          <Pagination page={page} lastPage={lastPage} onPageChange={setPage} loading={loading} />
        </>
      )}
    </Modal>
  );
};

export default AllSalesModal;
