import { useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner/Spinner";
import ReportService from "../../services/ReportService";
import { formatCurrency } from "../../utils/format";

const ReportsPage = () => {
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{ date: string; transactions: number; revenue: string; profit: string }[]>([]);
  const [totals, setTotals] = useState<{ transactions: number; revenue: string; profit: string } | null>(null);
  const [topProducts, setTopProducts] = useState<{ name: string; brand: string; size: string; units_sold: number; revenue: string; profit: string }[]>([]);
  const [inventory, setInventory] = useState<{ totals: { stock_value: number; potential_revenue: number; low_stock_count: number }; products: { name: string; brand: string; size: string; quantity: number; stock_value: number; is_low_stock: boolean }[] } | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      ReportService.salesSummary(from, to),
      ReportService.topProducts(from, to),
      ReportService.inventory(),
    ])
      .then(([salesRes, topRes, invRes]) => {
        setSummary(salesRes.data.summary);
        setTotals(salesRes.data.totals);
        setTopProducts(topRes.data.top_products);
        setInventory(invRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = "Reports | RESOLERXS";
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Reports</h1>
        <p className="mt-1 text-rx-muted">Sales performance and inventory valuation</p>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-rx-border bg-rx-card p-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-rx-muted">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg border border-rx-border bg-rx-bg px-3 py-2 text-white" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-rx-muted">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-lg border border-rx-border bg-rx-bg px-3 py-2 text-white" />
        </div>
        <button type="button" onClick={load} className="rounded-lg bg-rx-accent px-5 py-2 text-sm font-bold uppercase text-white hover:bg-rx-accent-hover">
          Apply
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {totals && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-rx-border bg-rx-card p-5">
                <p className="text-xs uppercase tracking-wider text-rx-muted">Transactions</p>
                <p className="mt-1 text-2xl font-extrabold">{totals.transactions}</p>
              </div>
              <div className="rounded-xl border border-rx-border bg-rx-card p-5">
                <p className="text-xs uppercase tracking-wider text-rx-muted">Revenue</p>
                <p className="mt-1 text-2xl font-extrabold text-rx-accent">{formatCurrency(Number(totals.revenue))}</p>
              </div>
              <div className="rounded-xl border border-rx-border bg-rx-card p-5">
                <p className="text-xs uppercase tracking-wider text-rx-muted">Profit</p>
                <p className="mt-1 text-2xl font-extrabold text-emerald-400">{formatCurrency(Number(totals.profit))}</p>
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-rx-border bg-rx-card p-4">
              <h2 className="mb-4 font-bold">Daily Sales</h2>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase text-rx-muted">
                    <tr>
                      <th className="pb-2">Date</th>
                      <th className="pb-2 text-right">Revenue</th>
                      <th className="pb-2 text-right">Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rx-border">
                    {summary.map((row) => (
                      <tr key={row.date}>
                        <td className="py-2">{row.date}</td>
                        <td className="py-2 text-right">{formatCurrency(Number(row.revenue))}</td>
                        <td className="py-2 text-right text-emerald-400">{formatCurrency(Number(row.profit))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-rx-border bg-rx-card p-4">
              <h2 className="mb-4 font-bold">Top Products</h2>
              <ul className="max-h-64 space-y-2 overflow-y-auto">
                {topProducts.map((p, i) => (
                  <li key={i} className="flex justify-between border-b border-rx-border pb-2 text-sm">
                    <span>
                      {p.name} <span className="text-rx-muted">({p.brand} {p.size})</span>
                    </span>
                    <span className="font-medium">{p.units_sold} sold</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {inventory && (
            <div className="rounded-xl border border-rx-border bg-rx-card p-4">
              <h2 className="mb-4 font-bold">Inventory Valuation</h2>
              <div className="mb-4 grid gap-4 sm:grid-cols-3 text-sm">
                <p>Stock value: <strong>{formatCurrency(inventory.totals.stock_value)}</strong></p>
                <p>Potential revenue: <strong>{formatCurrency(inventory.totals.potential_revenue)}</strong></p>
                <p>Low stock items: <strong className="text-rx-accent">{inventory.totals.low_stock_count}</strong></p>
              </div>
              <div className="max-h-48 overflow-y-auto text-sm">
                {inventory.products.slice(0, 15).map((p) => (
                  <div key={`${p.name}-${p.size}`} className="flex justify-between border-b border-rx-border py-2">
                    <span>
                      {p.name} ({p.brand} {p.size}) {p.is_low_stock && <span className="text-rx-accent">LOW</span>}
                    </span>
                    <span>{p.quantity} units · {formatCurrency(p.stock_value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsPage;
