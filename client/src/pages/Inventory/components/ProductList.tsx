import { useCallback, useEffect, useRef, useState, type FC } from "react";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
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
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductColumns[]>([]);
  const [page, setPage] = useState(1);
  const [, setLastPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const load = async (p: number, append: boolean, q: string, low: boolean) => {
    try {
      setLoading(true);
      const res = await ProductService.loadProducts(p, q, low);
      const data = res.data.products.data ?? [];
      const lp = res.data.products.last_page ?? 1;
      setProducts(append ? [...products, ...data] : data);
      setPage(p);
      setLastPage(lp);
      setHasMore(p < lp);
    } catch {
      if (!append) setProducts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    const ref = tableRef.current;
    if (
      ref &&
      ref.scrollTop + ref.clientHeight >= ref.scrollHeight - 10 &&
      hasMore &&
      !loading
    ) {
      load(page + 1, true, debouncedSearch, lowStockOnly);
    }
  }, [hasMore, loading, page, debouncedSearch, lowStockOnly, products]);

  useEffect(() => {
    const ref = tableRef.current;
    ref?.addEventListener("scroll", handleScroll);
    return () => ref?.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    load(1, false, debouncedSearch, lowStockOnly);
  }, [refreshKey, debouncedSearch, lowStockOnly]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Inventory</h1>
        <p className="mt-1 text-rx-muted">Manage shoe products and stock levels</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-rx-border bg-rx-card">
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
        <div
          ref={tableRef}
          className="max-h-[calc(100vh-14rem)] overflow-auto"
        >
          <Table>
            <TableHeader className="sticky top-0 z-10 border-b border-rx-border bg-rx-surface text-xs uppercase tracking-wider text-rx-muted">
              <TableRow>
                <TableCell isHeader className="px-4 py-3">Image</TableCell>
                <TableCell isHeader className="px-4 py-3">Product</TableCell>
                <TableCell isHeader className="px-4 py-3">Brand</TableCell>
                <TableCell isHeader className="px-4 py-3 text-center">Size</TableCell>
                <TableCell isHeader className="px-4 py-3 text-right">Capital</TableCell>
                <TableCell isHeader className="px-4 py-3 text-right">Price</TableCell>
                <TableCell isHeader className="px-4 py-3 text-center">Qty</TableCell>
                <TableCell isHeader className="px-4 py-3 text-center">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-rx-border text-sm">
              {products.length > 0 ? (
                products.map((p) => (
                  <TableRow key={p.product_id} className="hover:bg-white/5">
                    <TableCell className="px-4 py-3">
                      <ProductImage
                        productId={p.product_id}
                        hasImage={p.has_image}
                        alt={p.name}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium text-white">
                      {p.name}
                      {p.is_low_stock && (
                        <span className="ml-2 text-xs text-rx-accent">LOW</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-rx-muted">{p.brand}</TableCell>
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
              ) : !loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="px-4 py-8 text-center text-rx-muted">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              )}
              {loading && products.length > 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-4 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
