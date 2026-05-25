import { useEffect, useState } from "react";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import Pagination from "../../components/Pagination/Pagination";
import { Spinner } from "../../components/Spinner/Spinner";
import { useLowStock } from "../../contexts/LowStockContext";
import { useToastMessage } from "../../hooks/useToastMessage";
import type { CartItem, SaleColumns } from "../../Interfaces/SaleInterface";
import type { ProductColumns } from "../../Interfaces/ProductInterface";
import ProductService from "../../services/ProductService";
import SaleService from "../../services/SaleService";
import { formatCurrency, formatDate } from "../../utils/format";
import { parsePaginatedResponse } from "../../utils/pagination";
import AllSalesModal from "./components/AllSalesModal";

const SalesPage = () => {
  const toast = useToastMessage("", false, false);
  const { refreshLowStock } = useLowStock();
  const [products, setProducts] = useState<ProductColumns[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [sales, setSales] = useState<SaleColumns[]>([]);
  const [salesPage, setSalesPage] = useState(1);
  const [salesLastPage, setSalesLastPage] = useState(1);
  const [salesLoading, setSalesLoading] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [allSalesOpen, setAllSalesOpen] = useState(false);

  const loadProducts = () => {
    setLoadingProducts(true);
    ProductService.loadAllProducts()
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoadingProducts(false));
  };

  const loadSales = (page: number) => {
    setSalesLoading(true);
    SaleService.loadSales(page)
      .then((res) => {
        const { data, currentPage, lastPage } = parsePaginatedResponse<SaleColumns>(res.data.sales);
        setSales(data);
        setSalesPage(currentPage);
        setSalesLastPage(lastPage);
      })
      .catch(() => {
        setSales([]);
        setSalesLastPage(1);
      })
      .finally(() => setSalesLoading(false));
  };

  useEffect(() => {
    document.title = "Sales | RESOLERXS";
    loadProducts();
    loadSales(1);
  }, []);

  const filtered = products.filter((p) => {
    const q = productSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.size.toLowerCase().includes(q)
    );
  });

  const addToCart = (p: ProductColumns) => {
    const existing = cart.find((c) => c.product_id === p.product_id);
    if (existing) {
      if (existing.quantity >= p.quantity) {
        toast.showToastMessage("Not enough stock available.", true);
        return;
      }
      setCart(
        cart.map((c) =>
          c.product_id === p.product_id ? { ...c, quantity: c.quantity + 1 } : c,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          product_id: p.product_id,
          name: p.name,
          brand: p.brand,
          size: p.size,
          quantity: 1,
          unit_price: Number(p.selling_price),
          unit_cost: Number(p.capital_price),
          max_quantity: p.quantity,
        },
      ]);
    }
  };

  const updateQty = (id: number, qty: number) => {
    setCart(
      cart
        .map((c) => {
          if (c.product_id !== id) return c;
          const next = Math.max(1, Math.min(qty, c.max_quantity));
          return { ...c, quantity: next };
        })
        .filter((c) => c.quantity > 0),
    );
  };

  const removeFromCart = (id: number) => setCart(cart.filter((c) => c.product_id !== id));

  const cartTotal = cart.reduce((s, c) => s + c.unit_price * c.quantity, 0);
  const cartProfit = cart.reduce(
    (s, c) => s + (c.unit_price - c.unit_cost) * c.quantity,
    0,
  );

  const checkout = async () => {
    if (cart.length === 0) {
      toast.showToastMessage("Add at least one item to the cart.", true);
      return;
    }
    setCheckoutLoading(true);
    try {
      const res = await SaleService.storeSale({
        notes: notes || undefined,
        items: cart.map((c) => ({ product_id: c.product_id, quantity: c.quantity })),
      });
      toast.showToastMessage(res.data.message);
      setCart([]);
      setNotes("");
      loadProducts();
      loadSales(salesPage);
      await refreshLowStock();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string; errors?: { items?: string[] } } } };
      const msg =
        ax.response?.data?.errors?.items?.[0] ??
        ax.response?.data?.message ??
        "Could not complete sale.";
      toast.showToastMessage(msg, true);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <ToastMessage
        message={toast.message}
        isFailed={toast.isFailed}
        isVisible={toast.isVisible}
        onClose={toast.closeToastMessage}
      />
      <AllSalesModal isOpen={allSalesOpen} onClose={() => setAllSalesOpen(false)} />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Sales</h1>
          <p className="mt-1 text-rx-muted">Record transactions and view history</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-rx-border bg-rx-card p-4">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-rx-muted">
              Products
            </h2>
            <input
              type="text"
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="mb-4 w-full rounded-lg border border-rx-border bg-rx-bg px-3 py-2 text-sm text-white placeholder:text-rx-muted focus:border-rx-accent focus:outline-none"
            />
            {loadingProducts ? (
              <div className="flex justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : (
              <ul className="max-h-80 space-y-2 overflow-y-auto">
                {filtered.map((p) => (
                  <li
                    key={p.product_id}
                    className="flex items-center justify-between rounded-lg border border-rx-border bg-rx-bg px-3 py-2"
                  >
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-rx-muted">
                        {p.brand} · {p.size} · {p.quantity} in stock
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(p)}
                      disabled={p.quantity < 1}
                      className="rounded-lg bg-rx-accent px-3 py-1.5 text-xs font-bold uppercase text-white hover:bg-rx-accent-hover disabled:opacity-40"
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-rx-border bg-rx-card p-4">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-rx-muted">
              Cart
            </h2>
            {cart.length === 0 ? (
              <p className="py-8 text-center text-sm text-rx-muted">Cart is empty</p>
            ) : (
              <ul className="mb-4 max-h-56 space-y-2 overflow-y-auto">
                {cart.map((c) => (
                  <li
                    key={c.product_id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-rx-border bg-rx-bg px-3 py-2 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{c.name}</p>
                      <p className="text-xs text-rx-muted">
                        {formatCurrency(c.unit_price)} each
                      </p>
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={c.max_quantity}
                      value={c.quantity}
                      onChange={(e) => updateQty(c.product_id, Number(e.target.value))}
                      className="w-14 rounded border border-rx-border bg-rx-card px-2 py-1 text-center text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromCart(c.product_id)}
                      className="text-rx-accent hover:underline"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="space-y-2 border-t border-rx-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-rx-muted">Subtotal</span>
                <span className="font-bold">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Est. profit</span>
                <span className="font-bold">{formatCurrency(cartProfit)}</span>
              </div>
            </div>
            <textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-4 w-full rounded-lg border border-rx-border bg-rx-bg px-3 py-2 text-sm text-white placeholder:text-rx-muted focus:border-rx-accent focus:outline-none"
              rows={2}
            />
            <button
              type="button"
              onClick={checkout}
              disabled={checkoutLoading || cart.length === 0}
              className="mt-4 w-full rounded-lg bg-rx-accent py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-rx-accent-hover disabled:opacity-50"
            >
              {checkoutLoading ? "Processing..." : "Complete Sale"}
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-rx-border bg-rx-card">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-rx-muted">
              Recent Sales
            </h2>
            <button
              type="button"
              onClick={() => setAllSalesOpen(true)}
              className="rounded-lg border border-rx-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-rx-accent transition hover:bg-rx-accent/10"
            >
              View All Sales
            </button>
          </div>
          <div className={`p-4 pt-0 ${salesLoading ? "opacity-60" : ""}`}>
            {sales.length === 0 && !salesLoading ? (
              <p className="py-4 text-sm text-rx-muted">No sales recorded yet.</p>
            ) : (
              <ul className="space-y-3">
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
            )}
          </div>
          <Pagination
            page={salesPage}
            lastPage={salesLastPage}
            onPageChange={loadSales}
            loading={salesLoading}
          />
        </div>
      </div>
    </>
  );
};

export default SalesPage;
