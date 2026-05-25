import { useEffect, useState, type FC } from "react";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Pagination from "../../../components/Pagination/Pagination";
import { Spinner } from "../../../components/Spinner/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import ProductImage from "../../../components/ProductImage/ProductImage";
import type { ProductColumns } from "../../../Interfaces/ProductInterface";
import ProductService from "../../../services/ProductService";
import { formatCurrency } from "../../../utils/format";
import { parsePaginatedResponse } from "../../../utils/pagination";

const PER_PAGE = 15;

interface ProductListProps {
  refreshKey: boolean;
  onAdd: () => void;
  onEdit: (product: ProductColumns) => void;
  onDelete: (product: ProductColumns) => void;
}

const ProductList: FC<ProductListProps> = ({
  refreshKey,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [products, setProducts] = useState<ProductColumns[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const load = async (p: number, q: string, low: boolean, isInitial: boolean) => {
    try {
      if (isInitial) {
        setInitialLoading(true);
      } else {
        setPageLoading(true);
      }
      const res = await ProductService.loadProducts(p, q, low);
      const { data, currentPage, lastPage: lp, total: t } = parsePaginatedResponse<ProductColumns>(
        res.data.products,
      );
      setProducts(data);
      setPage(currentPage);
      setLastPage(lp);
      setTotal(t);
    } catch {
      setProducts([]);
      setLastPage(1);
      setTotal(0);
    } finally {
      setInitialLoading(false);
      setPageLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
    load(1, debouncedSearch, lowStockOnly, true);
  }, [refreshKey, debouncedSearch, lowStockOnly]);

  const handlePageChange = (nextPage: number) => {
    load(nextPage, debouncedSearch, lowStockOnly, false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Inventory</h1>
        <p className="mt-1 text-rx-muted">Manage shoe products and stock levels</p>
      </div>
      <div className="flex flex-col overflow-hidden rounded-xl border border-rx-border bg-rx-card">
        <div className="border-b border-rx-border p-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="w-64">
              <FloatingLabelInput
                label="Search"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-rx-muted">
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(e) => setLowStockOnly(e.target.checked)}
                className="accent-rx-accent"
              />
              Low stock only
            </label>
            <button
              type="button"
              onClick={onAdd}
              className="rounded-lg bg-rx-accent px-4 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-rx-accent-hover"
            >
              Add Product
            </button>
          </div>
        </div>
        <div className={`min-h-0 flex-1 overflow-auto ${pageLoading ? "opacity-60" : ""}`}>
          <Table>
            <TableHeader className="sticky top-0 z-10 border-b border-rx-border bg-rx-surface text-xs uppercase tracking-wider text-rx-muted">
              <TableRow>
                <TableCell isHeader className="px-4 py-3 text-center">Image</TableCell>
                <TableCell isHeader className="px-4 py-3 text-center">Product</TableCell>
                <TableCell isHeader className="px-4 py-3 text-center">Brand</TableCell>
                <TableCell isHeader className="px-4 py-3 text-center">Size</TableCell>
                <TableCell isHeader className="px-4 py-3 text-right">Capital</TableCell>
                <TableCell isHeader className="px-4 py-3 text-right">Price</TableCell>
                <TableCell isHeader className="px-4 py-3 text-center">Qty</TableCell>
                <TableCell isHeader className="px-4 py-3 text-center">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-rx-border text-sm">
              {initialLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              ) : products.length > 0 ? (
                products.map((p) => (
                  <TableRow key={p.product_id} className="hover:bg-white/5">
                    <TableCell className="px-4 py-3">
                      <div className="flex justify-center">
                        <ProductImage
                          productId={p.product_id}
                          hasImage={p.has_image}
                          alt={p.name}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center font-medium text-white">
                      <span className="inline-flex flex-wrap items-center justify-center gap-2">
                        {p.name}
                        {p.is_low_stock && (
                          <span className="text-xs text-rx-accent">LOW</span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center text-rx-muted">{p.brand}</TableCell>
                    <TableCell className="px-4 py-3 text-center">{p.size}</TableCell>
                    <TableCell className="px-4 py-3 text-right">{formatCurrency(Number(p.capital_price))}</TableCell>
                    <TableCell className="px-4 py-3 text-right">{formatCurrency(Number(p.selling_price))}</TableCell>
                    <TableCell className={`px-4 py-3 text-center font-bold ${p.is_low_stock ? "text-rx-accent" : ""}`}>
                      {p.quantity}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex justify-center gap-3">
                        <button type="button" className="text-emerald-400 hover:underline" onClick={() => onEdit(p)}>Edit</button>
                        <button type="button" className="text-rx-accent hover:underline" onClick={() => onDelete(p)}>Delete</button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="px-4 py-8 text-center text-rx-muted">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {!initialLoading && (
          <Pagination
            page={page}
            lastPage={lastPage}
            total={total}
            perPage={PER_PAGE}
            alwaysShow
            onPageChange={handlePageChange}
            loading={pageLoading}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;
